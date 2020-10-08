// Firebase configuration
const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

var firebaseConfig = {
  apiKey: 'AIzaSyBFDLApFjnSiv7Jb7nOBDxTwJa7ntZy-_A',
  authDomain: 'tech-news-app-4e549.firebaseapp.com',
  databaseURL: 'https://tech-news-app-4e549.firebaseio.com',
  projectId: 'tech-news-app-4e549',
  storageBucket: 'tech-news-app-4e549.appspot.com',
  messagingSenderId: '762605078939',
  appId: '1:762605078939:web:48a9ef048a78eddcd6793e',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore();

module.exports = { firebase, firebaseConfig };
