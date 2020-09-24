const fetch = require('node-fetch');

const { REACT_APP_NEWS_API_KEY: API_KEY } = process.env;
const URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&category=technology`;

exports.handler = async function () {
  try {
    const response = await fetch(URL, {
      headers: { Accept: 'application/json' },
    });
    console.log(response);
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();
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
