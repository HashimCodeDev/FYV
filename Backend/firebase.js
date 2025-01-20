const config = require('dotenv').config();
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: config.FIREBASE_PROJECT_ID,
  clientEmail: config.FIREBASE_CLIENT_EMAIL,
});

const db = admin.firestore();

module.exports = { admin, db };
