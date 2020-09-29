import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import AuthenticationContext from "../Authentication";
import Login from "../Login";
import * as CONSTANTS from "../../Constants";
import Home from "../Home";
import Join from "../Join";
import Match from "../Match";

const BodyContainer = () => {
  const { user } = useContext(AuthenticationContext);
  if (!user) {
    return <Login />;
  }
  return <BodyView />;
};

const BodyView = () => (
  <div>
    <Switch>
      <Route exact={true} path={CONSTANTS.ROUTE_HOME}>
        <Home />
      </Route>
      <Route path={CONSTANTS.ROUTE_MATCH}>
        <Match />
      </Route>
      <Route path={CONSTANTS.ROUTE_JOIN}>
        <Join />
      </Route>
    </Switch>
  </div>
);

export default BodyContainer;
