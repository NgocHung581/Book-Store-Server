import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAG78oME5Kahs83hgQGYDHzWZYlr7gjKC8",
    authDomain: "search-on-91335.firebaseapp.com",
    projectId: "search-on-91335",
    storageBucket: "search-on-91335.appspot.com",
    messagingSenderId: "265831331277",
    appId: "1:265831331277:web:b9d69413fb4519a305c084",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
