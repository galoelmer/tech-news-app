const firebase = require('firebase/app');
const admin = require('firebase-admin');
require('firebase/auth');

var serviceAccount = require('./serviceAccountKey.json');
var firebaseConfig = {
  apiKey: 'AIzaSyBFDLApFjnSiv7Jb7nOBDxTwJa7ntZy-_A',
  authDomain: 'tech-news-app-4e549.firebaseapp.com',
  databaseURL: 'https://tech-news-app-4e549.firebaseio.com',
  projectId: 'tech-news-app-4e549',
  storageBucket: 'tech-news-app-4e549.appspot.com',
  messagingSenderId: '762605078939',
  appId: '1:762605078939:web:48a9ef048a78eddcd6793e',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tech-news-app-4e549.firebaseio.com',
  });
}

const db = admin.firestore();

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'POST')
    return {
      statusCode: 400,
      body: 'Must POST to this function',
    };

    /**
     * TODO: 
     * - Add user input validation
     */

  const { name = 'Anonymous', email, password } = JSON.parse(event.body);

  try {
    const newUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    const userId = newUser.user.uid;
    const token = await newUser.user.getIdToken();

    const userCredentials = {
      name,
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
        body: JSON.stringify({ email: error.message }),
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
