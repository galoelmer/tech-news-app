const admin = require('firebase-admin');

var serviceAccount = require('../../serviceAccountKey');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tech-news-app-4e549.firebaseio.com',
  });
}

const db = admin.firestore();

// Check if user added article to favorites
const markFavorites = async (data, userId) => {
  const userFavoritesList = await db
    .collection('favorites')
    .where('users', 'array-contains', userId)
    .get();

  return data.map((article) => {
    userFavoritesList.forEach((doc) => {
      if (doc.id === article.id) {
        article.favorite = true;
      }
    });
    return article;
  });
};

exports.handler = async function (event) {
  const userId = event.queryStringParameters.userId;
  if (event.httpMethod !== 'GET')
    return {
      statusCode: 400,
      body: 'Must be a GET request',
    };

  try {
    let data = [];
    // Get News articles from firestore
    const newsArticlesRef = await db.collection('newsArticles').orderBy('publishedAt', 'desc').get();
    newsArticlesRef.forEach((doc) => {
      let item = doc.data();
      item.id = doc.id;
      data.push(item);
    });

    // Mark users favorite articles
    if (userId) {
      await markFavorites(data, userId);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    console.log(error); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: error.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
