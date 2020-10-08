const {firebase} = require('../firebase-config/config');
const { db } = require('../firebase-config/admin');

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
