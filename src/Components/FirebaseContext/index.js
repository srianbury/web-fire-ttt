import React, { createContext } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "../../Constants/firebase";

const FirebaseContext = createContext(null);
const FirebaseProvider = ({ children }) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;
export { FirebaseProvider };
