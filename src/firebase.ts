
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from  "firebase/auth";
const firebaseConfig = {

  apiKey: "AIzaSyAL2cCiXrqi-7ZK6vP27GEeiWlYFjM8gNg",

  authDomain: "tickets-1b8f3.firebaseapp.com",

  projectId: "tickets-1b8f3",

  storageBucket: "tickets-1b8f3.appspot.com",

  messagingSenderId: "575801920929",

  appId: "1:575801920929:web:d510585cdc87ff6d0ccfe0",

  measurementId: "G-HBH5XC0RE0"

};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};
// const analytics = getAnalytics(app);
