import React from "react";
import { HashRouter as Router } from "react-router-dom";
import { FirebaseProvider } from "../FirebaseContext";
import { AuthenticationProvider } from "../Authentication";
import Header from "../Header";
import Body from "../Body";

const App = () => (
  <FirebaseProvider>
    <AuthenticationProvider>
      <Router>
        <Header />
        <Body />
      </Router>
    </AuthenticationProvider>
  </FirebaseProvider>
);

export default App;
