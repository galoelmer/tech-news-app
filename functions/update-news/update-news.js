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

// Add source logo url to articles
const addLogoUrl = (sourceId) => {
  return sourceId
    ? `https://firebasestorage.googleapis.com/v0/b/tech-news-app-4e549.appspot.com/o/logos%2F${sourceId}.png?alt=media`
    : '#';
};

const modifyNewsData = (data) => {
  return data.articles
    .filter((item) => {
      return item.source.name &&
        item.title &&
        item.url &&
        item.urlToImage &&
        item.publishedAt &&
        item.description
        ? true
        : false;
    })
    .map((item) => {
      return {
        description: item.description,
        imageSource: addLogoUrl(item.source.id), // Add logo url if exist in db images store
        publishedAt: item.publishedAt,
        sourceName: item.source.name,
        title: item.title.slice(0, item.title.lastIndexOf('-')).trim(),
        url: item.url,
        urlToImage: item.urlToImage,
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
    // Add all current articles' titles to array
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
      newDataArticles.forEach((doc) => {
        const docRef = db.collection('newsArticles').doc();
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
