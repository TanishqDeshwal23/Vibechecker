import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAc6WToTCrcNbD4enW3vYUaN2le2E84H24",
  authDomain: "vibechecker-d751e.firebaseapp.com",
  projectId: "vibechecker-d751e",
  storageBucket: "vibechecker-d751e.firebasestorage.app",
  messagingSenderId: "582615416999",
  appId: "1:582615416999:web:99e50ccb7fa110519f9b82",
  measurementId: "G-CB4VTQ7FFP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);