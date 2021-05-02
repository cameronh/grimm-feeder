import firebase from 'firebase/app'
import 'firebase/database'
import dotenv from 'dotenv'
dotenv.config()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

export async function connectToDatabase() {
  if (firebase.apps.length) return firebase.database();

  const client = firebase.initializeApp(firebaseConfig)
  
  return client.database();
}