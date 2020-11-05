const firebase = require('firebase/app');
const validator = require('validator');
const firebaseConfig = require('../../firebaseConfig');
require('firebase/auth');

if (!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

// Validate login data
function validateLoginData({ email, password }) {
  let errors = {};
  if (validator.isEmpty(email)) {
    errors.email = 'Must not be empty';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Must be a valid email address';
  }
  if (validator.isEmpty(password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return {
      statusCode: 400,
      body: 'Must POST to this function',
    };

  // Server input validation
  const { valid, errors } = validateLoginData(JSON.parse(event.body));
  if (!valid)
    return {
      statusCode: 400,
      body: JSON.stringify(errors),
    };

  const { email, password } = JSON.parse(event.body);

  try {
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    const token = await data.user.getIdToken();

    return {
      statusCode: 201,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    if (
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          general: 'Wrong credentials, please try again',
        }),
      };
    }

    if (error.code === 'auth/too-many-requests')
      return {
        statusCode: 429,
        body: JSON.stringify({
          general:
            'We have blocked all requests from this device due to unusual activity. Try again later.',
        }),
      };

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.code }),
    };
  }
};
