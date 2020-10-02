const fetch = require('node-fetch');
const { db } = require('../firebase-config/admin');

const { REACT_APP_NEWS_API_KEY: API_KEY } = process.env;
const URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&category=technology`;

exports.handler = async function (event) {
  const getDataFrom = event.queryStringParameters.from;

  try {
    let data;
    if (getDataFrom === 'firestore') {
      if (event.httpMethod !== 'GET')
        return {
          statusCode: 400,
          body: 'Must be a GET request',
        };
      const newsRef = db.collection('news').doc('list');
      const doc = await newsRef.get();
      data = doc.data();
    } else {
      const response = await fetch(URL, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        // NOT res.status >= 200 && res.status < 300
        return { statusCode: response.status, body: response.statusText };
      }
      data = await response.json();
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
