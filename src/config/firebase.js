import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCIgZP_8vORp2apNKO974QLmSydZv9SOss",
    authDomain: "search-70d32.firebaseapp.com",
    projectId: "search-70d32",
    storageBucket: "search-70d32.appspot.com",
    messagingSenderId: "251605583408",
    appId: "1:251605583408:web:3a966052dfefecb32ecff5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
