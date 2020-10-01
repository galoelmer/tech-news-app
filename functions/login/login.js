const firebase = require('../firebase-config/config');

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
      body: JSON.stringify(token),
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
