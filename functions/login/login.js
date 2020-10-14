const firebase = require('firebase/app');
require('firebase/auth');

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

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return {
      statusCode: 400,
      body: 'Must POST to this function',
    };

  /**
   * TODO:
   * - Add user input validation
   */

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

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.code }),
    };
  }
};
