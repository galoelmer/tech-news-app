const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../firebase-config/admin');
const { firebaseConfig } = require('../firebase-config/config');

const { REACT_APP_NEWS_API_KEY: API_KEY } = process.env;
const URL = `https://newsapi.org/v2/top-headlines?language=en&sources=engadget,techradar,the-next-web,the-verge,wired,techCrunch&apiKey=${API_KEY}`;

const addIdToArticles = (data) => {
  return data.articles.map((article) => {
    article.id = uuidv4();
    return article;
  });
};

// Add source log url to articles
const addLogoUrl = (data) => {
  return data.articles.map((article) => {
    let imageName = article.source.id;
    let imageURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/logos%2F${imageName}.png?alt=media`;
    article.imageSource = imageURL;
    return article;
  });
};

// Check if user added article to favorites
const markFavorites = async (data, userId) => {
  const userFavoritesList = await db
    .collection('favorites')
    .where('users', 'array-contains', userId)
    .get();

  return data.articles.map((article) => {
    userFavoritesList.forEach((doc) => {
      if (doc.id === article.id) {
        article.favorite = true;
      }
    });
    return article;
  });
};

exports.handler = async function (event) {
  const getDataFrom = event.queryStringParameters.from;
  const userId = event.queryStringParameters.userId;

  try {
    let data;
    if (getDataFrom === 'firestore') {
      if (event.httpMethod !== 'GET')
        return {
          statusCode: 400,
          body: 'Must be a GET request',
        };
      const docRef = await db.collection('news').doc('list').get();
      data = docRef.data();
      if (userId) {
        await markFavorites(data, userId);
      }
    } else {
      const response = await fetch(URL, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        // NOT res.status >= 200 && res.status < 300
        return { statusCode: response.status, body: response.statusText };
      }
      data = await response.json();
      addIdToArticles(data);
      addLogoUrl(data);
      await db.collection('news').doc('list').set(data);
      return { statusCode: response.status, body: response.statusText };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data: data.articles }),
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }),
    };
  }
};
