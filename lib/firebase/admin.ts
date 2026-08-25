// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCI5IK6juycPGiaSzIRvicC0GKvoQxZNK8",
  authDomain: "gestao-de-usuarios-3cd63.firebaseapp.com",
  projectId: "gestao-de-usuarios-3cd63",
  storageBucket: "gestao-de-usuarios-3cd63.firebasestorage.app",
  messagingSenderId: "798510446336",
  appId: "1:798510446336:web:a4d27f00935f9208eae5e5",
  measurementId: "G-6QPF6FJZ8Z",
};

// Inicializa de forma segura para o Next.js
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
