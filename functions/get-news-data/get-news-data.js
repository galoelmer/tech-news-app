const admin = require('firebase-admin');

var serviceAccount = require('../../serviceAccountKey');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tech-news-app-4e549.firebaseio.com',
  });
}

const db = admin.firestore();

exports.handler = async function (event) {
  const offset = event.queryStringParameters.offset;

  if (event.httpMethod !== 'GET')
    return {
      statusCode: 400,
      body: 'Must be a GET request',
    };

  try {
    const data = [];
    // Get News articles from firestore
    const newsArticlesRef = db
      .collection('newsArticles')
      .orderBy('publishedAt', 'desc')
      .limit(12)
      .offset(parseInt(offset) || 0);

    const snapshot = await newsArticlesRef.get();

    if (!snapshot.empty) {
      snapshot.docs.forEach((doc) => {
        let item = doc.data();
        item.id = doc.id;
        data.push(item);
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data, maxLimit: snapshot.size < 12 }),
    };
  } catch (error) {
    console.log(error); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: error.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
