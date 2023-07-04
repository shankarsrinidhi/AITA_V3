import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyBM8c6wiHZbMQYNOX3jl4SS-ziLG4pTdF8",
  authDomain: "bh-dev-867a5.firebaseapp.com",
  projectId: "bh-dev-867a5",
  storageBucket: "bh-dev-867a5.appspot.com",
  messagingSenderId: "874324419747",
  appId: "1:874324419747:web:17c4676a8e4bcbfb5ecb16",
  measurementId: "G-R7JK1V9ZP2"
};
const app = firebase.initializeApp(firebaseConfig);

/*const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
})*/

export const auth = app.auth()
export default app;