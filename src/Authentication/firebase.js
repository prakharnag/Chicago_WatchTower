// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import 'firebase/database';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBkMyR8uIchvsBn-gnLZmyWpCxCX0axqjM",
  authDomain: "chicago-watchtower.firebaseapp.com",
  projectId: "chicago-watchtower",
  storageBucket: "chicago-watchtower.appspot.com",
  messagingSenderId: "167868250606",
  appId: "1:167868250606:web:1469254c4b95107619b6ff",
  measurementId: "G-G0MZLK0WC6",
  databaseURL:'https://chicago-watchtower-default-rtdb.firebaseio.com/'
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);



