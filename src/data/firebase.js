import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCaSYgi7-COYTcMGdAryPOqT6Zr-6vV7As",
    authDomain: "superfix-f39d2.firebaseapp.com",
    projectId: "superfix-f39d2",
    storageBucket: "superfix-f39d2.appspot.com",
    messagingSenderId: "135944427002",
    appId: "1:135944427002:web:edd5a1e5775927e4e38043"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;