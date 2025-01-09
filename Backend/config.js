require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  JWT_SECRET: process.env.JWT_SECRET,
};
