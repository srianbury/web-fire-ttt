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

    let code;
    while (!code) {
      const tryCode = createRandomCode();
      const newMatchRef = await firebase
        .firestore()
        .collection("matches")
        .doc(tryCode)
        .get();
      if (!newMatchRef.data()) {
        code = tryCode;
      }
    }

    await firebase
      .firestore()
      .collection("matches")
      .doc(code)
      .set({
        players: [{ uid, isAnonymous, displayName, ready: false, host: true }],
        turn: uid,
        board: [null, null, null, null, null, null, null, null, null],
        gameState: CONSTANTS.GAME_STATE_LOBBY
      });

    history.push(`/match/${code}`);
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

function createRandomCode() {
  const VALUES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  while (code.length < 6) {
    code += VALUES[parseInt(Math.random() * 1000) % VALUES.length];
  }
  return code;
}

export default HomeContainer;
