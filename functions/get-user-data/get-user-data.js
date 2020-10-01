const { admin, db } = require('../firebase-config/admin');

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'GET')
    return {
      statusCode: 400,
      body: 'Must be a GET request',
    };

  let idToken;
  if (
    event.headers.authorization &&
    event.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = event.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return callback(null, {
      statusCode: 403,
      body: JSON.stringify({
        error: 'Unauthorized',
      }),
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userRef = db.collection('users').doc(decodedToken.uid);
    const doc = await userRef.get();
    const userData = doc.data();

    if (!doc.exists) {
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          general: 'Something went wrong, please try again',
        }),
      });
    }

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        userName: userData.name,
      }),
    });
  } catch (error) {
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        general: 'Something went wrong, please try again',
      }),
    });
  }
};
