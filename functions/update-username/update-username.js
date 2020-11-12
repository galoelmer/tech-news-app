const admin = require('firebase-admin');

const serviceAccount = require('../../serviceAccountKey');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}
const db = admin.firestore();

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'POST')
    return {
      statusCode: 400,
      body: 'Must be a POST request',
    };

  const { username } = JSON.parse(event.body);
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
    const res = await userRef.update({
      name: username,
      randomNameCreated: false,
    });

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ res }),
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
