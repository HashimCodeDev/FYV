const config = require('dotenv').config();
const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = JSON.parse(
  fs.readFileSync('./serviceAccountKey.json', 'utf8')
); // Path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: config.FIREBASE_PROJECT_ID,
  clientEmail: config.FIREBASE_CLIENT_EMAIL,
});

const db = admin.firestore();

module.exports = { admin, db };
