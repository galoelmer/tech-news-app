const { admin, db } = require('../firebase-config/admin');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return {
      statusCode: 400,
      body: 'Must be a POST request',
    };

  const { articleId, article, userId } = JSON.parse(event.body);

  if (!articleId || !article || !userId) {
    return {
      statusCode: 500,
      body:
        'Missing body properties ' +
        JSON.stringify({ articleId, article, userId }),
    };
  }

  try {
    const favoritesRef = db.collection('favorites');
    const doc = await favoritesRef.doc(articleId).get();

    if (doc.exists) {
      doc.ref.update({
        users: admin.firestore.FieldValue.arrayUnion(userId),
      });
    } else {
      doc.ref.set({ ...article, users: [userId] });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Article ${articleId} was added to favorites.`,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
