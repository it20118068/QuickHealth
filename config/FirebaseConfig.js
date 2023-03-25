import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCB7FBRHsZuSfJCl9A9V7xwzsR0ooIyiN8",
  authDomain: "echanneling-75f24.firebaseapp.com",
  projectId: "echanneling-75f24",
  storageBucket: "echanneling-75f24.appspot.com",
  messagingSenderId: "299127926303",
  appId: "1:299127926303:web:549b5d91f606b33649af2a",
  measurementId: "G-LSPVW2Q2XP"
};


if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase}