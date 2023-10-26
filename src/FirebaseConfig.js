import { initializeApp } from '@react-native-firebase/app';
import { getFirestore } from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB4EWCWGHjTpb60Qf2R8opmch5Rym79dLo",
  authDomain: "myapp-2f8e1.firebaseapp.com",
  projectId: "myapp-2f8e1",
  databaseURL: "https://myapp-2f8e1-default-rtdb.europe-west1.firebasedatabase.app", 
  storageBucket: "myapp-2f8e1.appspot.com",
  messagingSenderId: "104956284102",
  appId: "1:104956284102:web:d6dc189dae34d3aeb11bc7",
  measurementId: "G-RCFY2VF137"
};

const firebaseApp = initializeApp(firebaseConfig);

// Obtén la instancia de Firestore
const firestore = getFirestore(firebaseApp);

export { firebaseApp, firestore };
