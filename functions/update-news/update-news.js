const fetch = require('node-fetch');
const admin = require('firebase-admin');
const { Base64 } = require('js-base64');

var serviceAccount = require('../../serviceAccountKey');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tech-news-app-4e549.firebaseio.com',
  });
}

const db = admin.firestore();

const { REACT_APP_NEWS_API_KEY: API_KEY } = process.env;
const URL = `http://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${API_KEY}`;

const modifyNewsData = (data) => {
  return data.articles
    .filter((item) => {
      return item.source.name &&
        item.title &&
        item.url &&
        item.urlToImage &&
        item.publishedAt
        ? true
        : false;
    })
    .map((item) => {
      return {
        sourceName: item.source.name,
        title: item.title,
        url: item.url,
        urlToImage: item.urlToImage,
        publishedAt: item.publishedAt,
      };
    });
};

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
    // Request news articles from API provider
    const response = await fetch(URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }

    let data = await response.json();

    // Filter News articles to custom object
    const filterNewsData = modifyNewsData(data);

    let listOfArticlesTitles = [];
    let newDataArticles = [];

    // Get all current articles from firestore
    const articlesRef = await db.collection('newsArticles').get();
    // Store all current articles' titles to array
    articlesRef.forEach((doc) => {
      listOfArticlesTitles.push(doc.data().title);
    });

    // Filter repeated News articles from API provider
    filterNewsData.forEach((item) => {
      if (!listOfArticlesTitles.includes(item.title)) {
        newDataArticles.push(item);
      }
    });

    // Add news articles to firestore
    if (newDataArticles.length) {
      const batch = db.batch();
      const docRef = db.collection('newsArticles').doc();
      newDataArticles.forEach((doc) => {
        console.log('added: ', doc);
        batch.set(docRef, doc);
      });
      batch.commit();
    }

    return {
      statusCode: response.status,
      body: newDataArticles.length
        ? 'Successful DB Update'
        : 'DB update not required',
    };
  } catch (error) {
    console.log(error); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: error.message }),
    };
  }
};
