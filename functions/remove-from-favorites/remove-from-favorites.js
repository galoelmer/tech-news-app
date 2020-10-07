const { admin, db } = require('../firebase-config/admin');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return {
      statusCode: 400,
      body: 'Must be a POST request',
    };

  const { articleId, userId } = JSON.parse(event.body);

  if (!articleId || !userId) {
    return {
      statusCode: 500,
      body: 'Missing body properties ' + JSON.stringify({ articleId, userId }),
    };
  }
  const favoritesRef = db.collection('favorites');
  const doc = await favoritesRef.doc(articleId).get();

  if (!doc.exists) {
    return { statusCode: 404, body: 'Doc not found' };
  }

  const observer = doc.ref.onSnapshot((docSnapshot) => {
    const data = docSnapshot.data();
    if (data.hasOwnProperty('users') && data.users.length === 0) {
      favoritesRef.doc(articleId).delete();
      observer();
    }
  });

  try {
    await doc.ref.update({
      users: admin.firestore.FieldValue.arrayRemove(userId),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `UserId ${userId} successfully removed.`,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
