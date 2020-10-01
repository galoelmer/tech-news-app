const admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tech-news-app-4e549.firebaseio.com',
});

const db = admin.firestore();

module.exports = { admin, db };
