//import { initializeApp } from "firebase/app";

const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

// Initialize the Firebase Admin SDK with your credentials
const firebaseConfig = {
    apiKey: "AIzaSyBM8c6wiHZbMQYNOX3jl4SS-ziLG4pTdF8",
    authDomain: "bh-dev-867a5.firebaseapp.com",
    projectId: "bh-dev-867a5",
    storageBucket: "bh-dev-867a5.appspot.com",
    messagingSenderId: "874324419747",
    appId: "1:874324419747:web:17c4676a8e4bcbfb5ecb16",
    measurementId: "G-R7JK1V9ZP2"
  };

  admin.initializeApp(firebaseConfig);

// Middleware function to protect routes
function authenticateFirebaseToken(req, res, next) {
  // Check if the authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  // Verify the token using Firebase Admin SDK
  admin.auth().verifyIdToken(token)
    .then((decodedToken) => {
      // Token is valid, you can access the decoded user information if needed
      req.user = decodedToken;
      return next();
    })
    .catch((error) => {
      console.error('Error verifying Firebase token:', error);
      return res.status(403).json({ error: 'Forbidden: Invalid token.' });
    });
}

module.exports = authenticateFirebaseToken;