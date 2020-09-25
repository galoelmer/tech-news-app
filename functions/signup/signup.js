const firebase = require('../firebase-config/config');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return { statusCode: 400, body: 'Must POST to this function' };

  const { email, password } = JSON.parse(event.body);

  try {
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    return { statusCode: 201, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
