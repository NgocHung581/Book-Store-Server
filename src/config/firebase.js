import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDF6d7ku7vDMSl-YyaM6SwnWG9SO90m3aY",
    authDomain: "search-web-91850.firebaseapp.com",
    projectId: "search-web-91850",
    storageBucket: "search-web-91850.appspot.com",
    messagingSenderId: "628629172734",
    appId: "1:628629172734:web:1cc0a2758aa953e7ae90af",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
