import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthenticationContext from "../Authentication";
import * as CONSTANTS from "../../Constants";

const HeaderContainer = () => {
  const { user } = useContext(AuthenticationContext);
  return <HeaderView user={user} />;
};

const HeaderView = ({ user }) => (
  <div>
    <div>Firebase Tic-Tac-Toe</div>
    <UsernameContainer user={user} />
    <nav>
      <ul>
        <li>
          <Link to={CONSTANTS.ROUTE_HOME}>Home</Link>
        </li>
      </ul>
    </nav>
    {user ? <LogoutContainer /> : null}
  </div>
);

const UsernameContainer = ({ user }) => {
  // {user ? <div>Username: {user}</div> : <div>Not logged in</div>}
  if (user) {
    const { isAnonymous, displayName } = user;
    if (isAnonymous) {
      return <div>Username: Anon</div>;
    }
    return <div>Username: {displayName}</div>;
  }
  return <div>Not Logged In</div>;
};

const LogoutContainer = () => {
  const { logout } = useContext(AuthenticationContext);
  return <LogoutView logout={logout} />;
};

const LogoutView = ({ logout }) => (
  <button type="button" onClick={logout}>
    Logout
  </button>
);

export default HeaderContainer;
