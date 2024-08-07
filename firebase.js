// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAukKvUn710QrOr8iKWnk0FVfvtr5ROjz8",
  authDomain: "inventory-management-b7a35.firebaseapp.com",
  projectId: "inventory-management-b7a35",
  storageBucket: "inventory-management-b7a35.appspot.com",
  messagingSenderId: "431994926178",
  appId: "1:431994926178:web:93f530b74126cb6fb08d3b",
  measurementId: "G-Q4G4YGVDVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage();

export {firestore};