import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMxQ0uQdrwlS3F62fPWG8PVXl5jTOyau8",
  authDomain: "whatsapp-clone-36b61.firebaseapp.com",
  projectId: "whatsapp-clone-36b61",
  storageBucket: "whatsapp-clone-36b61.appspot.com",
  messagingSenderId: "301295243545",
  appId: "1:301295243545:web:124c4b8f432de985ddf588",
  measurementId: "G-MQHRE803VB",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
