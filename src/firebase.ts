
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getAuth} from  "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDkvTmzOwVmsS1vP3tkPJm2-1q6PlZYnDo",
  authDomain: "cf-work-d3dd6.firebaseapp.com",
  projectId: "cf-work-d3dd6",
  storageBucket: "cf-work-d3dd6.appspot.com",
  messagingSenderId: "952607854348",
  appId: "1:952607854348:web:45e3759e2ac0017c0a8329",
  measurementId: "G-3BKTGLKYDP"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};
// const analytics = getAnalytics(app);
