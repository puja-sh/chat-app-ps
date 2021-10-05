import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyC0O37JRT_laxen6x32U4NcdqrjP5xL9Bo',
  authDomain: 'chat-web-app-d1d12.firebaseapp.com',
  projectId: 'chat-web-app-d1d12',
  storageBucket: 'chat-web-app-d1d12.appspot.com',
  messagingSenderId: '511903723368',
  appId: '1:511903723368:web:4a4980061f5cf68c5b70dd',
};

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
