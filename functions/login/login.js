const firebase = require('../firebase-config/config');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return { statusCode: 400, body: 'Must POST to this function' };

  const { email, password } = JSON.parse(event.body);
  try {
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    const token = await data.user.getIdToken();

    return { statusCode: 201, body: JSON.stringify(token) };
  } catch (err) {
    return { statusCode: 403, body: JSON.stringify(err) };
  }
};
