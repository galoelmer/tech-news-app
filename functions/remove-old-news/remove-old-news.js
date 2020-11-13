const admin = require('firebase-admin');
const { Base64 } = require('js-base64');

const serviceAccount = require('../../serviceAccountKey');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.firestore();

// Decode basic authorization header
function checkCredentials(basicAuth) {
  const decode = Base64.decode(basicAuth).split(':');
  return (
    decode[0] === process.env.CRON_USERNAME &&
    decode[1] === process.env.CRON_PASSWORD
  );
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET')
    return {
      statusCode: 400,
      body: 'Must be a GET request',
    };

  // Request authorization decoding credentials
  const authHeader = event.headers.authorization.split(' ')[1];
  const authenticated = checkCredentials(authHeader);
  if (!authenticated)
    return {
      statusCode: 401,
      body: 'Unauthorized',
    };

  try {
    const limitDate = new Date(Date.now());
    limitDate.setDate(limitDate.getDate() - 5);

    // Get all News older than 5 days from firestore
    const articlesRef = db
      .collection('newsArticles')
      .where('publishedAt', '<', `${limitDate.toISOString()}`);
    const snapshot = await articlesRef.get();
    if (!snapshot.empty) {
      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      batch.commit();
    }

    return {
      statusCode: 200,
      body: !snapshot.empty ? 'Successful DB Update' : 'DB update not required',
    };
  } catch (error) {
    console.log(error); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: error.message }),
    };
  }
};
