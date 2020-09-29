import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../FirebaseContext";
import AuthenticationContext from "../Authentication";
import * as CONSTANTS from "../../Constants";

const HomeContainer = () => {
  const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const { user } = useContext(AuthenticationContext);
  const { uid, isAnonymous, displayName } = user;
  const [creating, setCreating] = useState(false);

  async function createMatch() {
    setCreating(true);
    const newMatchRef = await firebase
      .firestore()
      .collection("matches")
      .add({
        players: [{ uid, isAnonymous, displayName, ready: false }],
        board: [null, null, null, null, null, null, null, null, null],
        gameState: CONSTANTS.GAME_STATE_LOBBY
      });
    history.push(`/match/${newMatchRef.id}`);
  }

  return <HomeView createMatch={createMatch} creating={creating} />;
};

const HomeView = ({ createMatch, creating }) => (
  <div>
    <button type="button" onClick={createMatch}>
      {creating ? "Creating your match" : "Start a match"}
    </button>
    {creating ? null : <Link to={CONSTANTS.ROUTE_JOIN}>Join a match</Link>}
  </div>
);

export default HomeContainer;
