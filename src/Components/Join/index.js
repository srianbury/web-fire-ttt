import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import FirebaseContext from "../FirebaseContext";
import AuthenticationContext from "../Authentication";
import { getRandomFirstTurn } from "../../Functions";

const JoinContainer = () => {
  const [joining, setJoining] = useState(false);
  const [code, setCode] = useState("");
  const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const { user } = useContext(AuthenticationContext);
  const { uid, isAnonymous, displayName } = user;

  async function onClick() {
    setJoining(true);
    const value = await firebase
      .firestore()
      .collection("matches")
      .doc(code)
      .get();
    const { players: currentPlayers } = value.data();
    const newPlayer = {
      displayName,
      isAnonymous,
      uid,
      ready: false,
      host: false
    };
    const nextPlayersState = [...currentPlayers, newPlayer];
    const turn = getRandomFirstTurn(nextPlayersState);
    await firebase
      .firestore()
      .collection("matches")
      .doc(code)
      .update({
        players: nextPlayersState,
        turn
      });
    history.push(`/match/${code}`);
  }

  return (
    <JoinView
      code={code}
      setCode={setCode}
      onClick={onClick}
      joining={joining}
    />
  );
};

const JoinView = ({ code, setCode, onClick, joining }) => (
  <div>
    <div>Enter the code to join</div>
    <input
      type="text"
      value={code}
      placeholder="Match code"
      onChange={e => setCode(e.target.value.toUpperCase())}
    />
    <button type="button" disabled={joining} onClick={onClick}>
      {joining ? "Joining..." : "Join!"}
    </button>
    <button type="button" onClick={() => {}}>
      Start a match instead
    </button>
  </div>
);

export default JoinContainer;
