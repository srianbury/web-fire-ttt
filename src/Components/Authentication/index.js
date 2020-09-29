import React, { useState, useContext, createContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import FirebaseContext from "../FirebaseContext";

const AuthenticationContext = createContext(null);
const AuthenticationProvider = ({ children }) => {
  const firebase = useContext(FirebaseContext);
  const [loggingIn, setLoggingIn] = useState(false);
  const authState = useAuthState(firebase.auth());
  const user = authState[0];
  const loading = authState[1];

  async function loginAnon() {
    setLoggingIn(true);
    await firebase.auth().signInAnonymously();
    setLoggingIn(false);
  }

  function logout() {
    firebase.auth().signOut();
  }

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        loginAnon,
        logout,
        loggingIn
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContext;
export { AuthenticationProvider };
