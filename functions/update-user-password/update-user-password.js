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

  const { password, oobCode } = JSON.parse(event.body);

  try {
    if (password) {
      await firebase.auth().confirmPasswordReset(oobCode, password);
    } else {
      await firebase.auth().verifyPasswordResetCode(oobCode);
    }

    return {
      statusCode: 200,
      body: password ? "success" : "valid-code",
    };
  } catch (error) {
    if (error.code === "auth/argument-error") {
      return {
        statusCode: 406,
        body: "Invalid URL",
      };
    }
    return { statusCode: 500, body: JSON.stringify(error.message) };
  }
};

module.exports = { handler };
