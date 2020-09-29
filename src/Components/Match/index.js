import React, { useContext, createContext } from "react";
import { useParams } from "react-router-dom";
import { useDocument } from "react-firebase-hooks/firestore";
import FirebaseContext from "../FirebaseContext";
import Loading from "../Loading";
import AuthenticationContext from "../Authentication";
import Gameboard from "../Gameboard";

function bothPlayersAreReady(players) {
  let ready = true;
  players.forEach(player => {
    if (!player.ready) {
      ready = false;
    }
  });
  return ready;
}

const MatchContext = createContext(null);
const MatchContextProvider = ({ children }) => {
  const firebase = useContext(FirebaseContext);
  const { matchId } = useParams();
  const [value, loading, error] = useDocument(
    firebase.firestore().doc(`matches/${matchId}`)
  );

  return (
    <MatchContext.Provider
      value={{
        matchId,
        value: value ? value.data() : value,
        loading,
        error
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

const MatchContainer = () => {
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(AuthenticationContext);
  const { matchId, value, loading } = useContext(MatchContext);

  async function toggleReady() {
    const nextPlayersState = value.players.map(player => {
      if (player.uid !== user.uid) {
        return player;
      }
      return { ...player, ready: !player.ready };
    });
    firebase
      .firestore()
      .collection("matches")
      .doc(matchId)
      .update({
        players: nextPlayersState
      });
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <MatchView
      matchId={matchId}
      players={value.players}
      toggleReady={toggleReady}
    />
  );
};

const MatchView = ({ matchId, players, toggleReady }) => (
  <div>
    <div>Match {matchId}</div>
    <ReadyStateContainer players={players} toggleReady={toggleReady} />
  </div>
);

const ReadyStateContainer = ({ players, toggleReady }) => {
  if (players.length === 1) {
    return <ReadyStateViewWaitingForOpponent />;
  }
  if (bothPlayersAreReady(players)) {
    return <Gameboard />;
  }
  return <ReadyStateView players={players} toggleReady={toggleReady} />;
};

const ReadyStateViewWaitingForOpponent = () => (
  <div>Waiting for an opponent..</div>
);

const ReadyStateView = ({ players, toggleReady }) => (
  <div>
    {players.map((player, index) => (
      <div key={player.uid}>
        <div>{`Player ${index + 1}: ${
          player.isAnonymous ? "Anon" : player.displayName
        }`}</div>
        <ReadyUpContainer player={player} toggleReady={toggleReady} />
      </div>
    ))}
  </div>
);

const ReadyUpContainer = ({ player, toggleReady }) => {
  const { user } = useContext(AuthenticationContext);
  if (player.uid !== user.uid) {
    return <div>{player.ready ? "Ready" : "Not Ready"}</div>;
  }
  return (
    <div>
      <button type="button" onClick={toggleReady}>
        {player.ready ? "Cancel" : "Ready Up!"}
      </button>
    </div>
  );
};

const MatchContainerWithMatchContext = () => (
  <MatchContextProvider>
    <MatchContainer />
  </MatchContextProvider>
);

export default MatchContainerWithMatchContext;
export { MatchContext };
