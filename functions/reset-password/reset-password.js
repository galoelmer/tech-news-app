const firebase = require("firebase/app");
const firebaseConfig = require("../../firebaseConfig");
require("firebase/auth");

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); // Initialize Firebase
}

const handler = async (event) => {
  if (event.httpMethod !== "POST")
    return {
      statusCode: 400,
      body: "Must POST to this function",
    };

  const { email } = JSON.parse(event.body);

  try {
    const data = await firebase
      .auth()
      .sendPasswordResetEmail(email);

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return {
        statusCode: 403,
        body: JSON.stringify({
          general: "There is no user record corresponding to this email",
        }),
      };
    }
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};

module.exports = { handler };
