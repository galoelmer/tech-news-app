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
    let favorites = [];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userFavorites = await db.collection('favorites').where('users', 'array-contains', decodedToken.uid).get();
    userFavorites.forEach(doc => favorites.push(doc.data()));

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        data: favorites
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
