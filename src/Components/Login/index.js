import React, { useContext } from "react";
import AuthenticationContext from "../Authentication";

const LoginContainer = () => {
  const { loginAnon, loggingIn } = useContext(AuthenticationContext);
  return <LoginView loginAnon={loginAnon} loggingIn={loggingIn} />;
};

const LoginView = ({ loginAnon, loggingIn }) => (
  <div>
    <button type="button" onClick={loginAnon}>
      {loggingIn ? "Loading..." : "Login Anonymously"}
    </button>
  </div>
);

export default LoginContainer;
