const admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tech-news-app-4e549.firebaseio.com',
  });
}
const db = admin.firestore();

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
    // Get user data
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

    // Get user favorites
    let favorites = [];
    const snapshot = await db
      .collection('favorites')
      .where('users', 'array-contains', decodedToken.uid)
      .get();
    snapshot.forEach((doc) => {
      const newsArticle = doc.data();
      delete newsArticle.users;
      favorites.push(newsArticle);
    });

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        userName: userData.name,
        userId: doc.id,
        favorites,
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
