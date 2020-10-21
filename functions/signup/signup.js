const firebase = require('firebase/app');
const admin = require('firebase-admin');
var validator = require('validator');
var chance = require('chance').Chance();
require('firebase/auth');

var serviceAccount = require('./serviceAccountKey');
var firebaseConfig = {
  apiKey: 'AIzaSyBFDLApFjnSiv7Jb7nOBDxTwJa7ntZy-_A',
  authDomain: 'tech-news-app-4e549.firebaseapp.com',
  databaseURL: 'https://tech-news-app-4e549.firebaseio.com',
  projectId: 'tech-news-app-4e549',
  storageBucket: 'tech-news-app-4e549.appspot.com',
  messagingSenderId: '762605078939',
  appId: '1:762605078939:web:48a9ef048a78eddcd6793e',
};

if (!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tech-news-app-4e549.firebaseio.com',
  });
}

const db = admin.firestore();

// Validate Signup data
function validateSignUpData({ name, email, password }) {
  let errors = {};
  if (validator.isEmpty(email)) {
    errors.email = 'Must not be empty';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Must be a valid email address';
  }

  if (validator.isEmpty(password)) {
    errors.password = 'Must not be empty';
  } else if (!validator.isLength(password, { min: 6, max: undefined })) {
    errors.password = 'Must be at least 6 characters long';
  } else if (validator.matches(password, /[\s]/g)) {
    errors.password = 'Must not contain spaces';
  } else if (!validator.matches(password, /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+/)) {
    errors.password = 'Must contain One Uppercase, One Lowercase and a Number';
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
    username: name.trim() === '' ? chance.name() : name,
  };
}

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'POST')
    return {
      statusCode: 400,
      body: 'Must POST to this function',
    };

  // Server input validation
  const { valid, errors, username } = validateSignUpData(
    JSON.parse(event.body)
  );
  console.log(username);
  if (!valid)
    return {
      statusCode: 400,
      body: JSON.stringify(errors),
    };

  const { email, password } = JSON.parse(event.body);

  try {
    const newUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    const userId = newUser.user.uid;
    const token = await newUser.user.getIdToken();

    const userCredentials = {
      name: username,
      email,
      createdAt: new Date().toISOString(),
    };

    await db.collection('users').doc(userId).set(userCredentials);

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        token,
      }),
    });
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          email: error.message,
        }),
      });
    }
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        general: 'Something went wrong, please try again',
      }),
    });
  }
};
