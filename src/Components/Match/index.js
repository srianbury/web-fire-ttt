import React, { useContext, createContext } from "react";
import { useParams } from "react-router-dom";
import { useDocument } from "react-firebase-hooks/firestore";
import FirebaseContext from "../FirebaseContext";
import Loading from "../Loading";
import AuthenticationContext from "../Authentication";
import Gameboard from "../Gameboard";
import * as CONSTANTS from "../../Constants";
import { bothPlayersAreReady, toggleReady } from "../../Functions";

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

function notAlreadyPlaying(gameState) {
  return gameState !== CONSTANTS.GAME_STATE_PLAYING;
}

const MatchContainer = () => {
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(AuthenticationContext);
  const { matchId, value, loading } = useContext(MatchContext);

  if (value) {
    const { players, gameState } = value;
    const thisPlayer = players.find(player => player.uid === user.uid);
    if (
      thisPlayer.host &&
      bothPlayersAreReady(players) &&
      notAlreadyPlaying(gameState)
    ) {
      const nextPlayerStates = players.map(player => ({
        ...player,
        ready: false
      })); // set players as not ready as the match begins so we can re-use this field to start a rematch
      firebase
        .firestore()
        .collection("matches")
        .doc(matchId)
        .update({
          gameState: CONSTANTS.GAME_STATE_PLAYING,
          players: nextPlayerStates
        });
    }
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <MatchView
      matchId={matchId}
      players={value.players}
      toggleReady={async () => await toggleReady(firebase, user, matchId)}
      gameState={value.gameState}
    />
  );
};

const MatchView = ({ matchId, players, toggleReady, gameState }) => (
  <div>
    <div>Match {matchId}</div>
    <ReadyStateContainer
      players={players}
      toggleReady={toggleReady}
      gameState={gameState}
    />
  </div>
);

const ReadyStateContainer = ({ players, toggleReady, gameState }) => {
  if (players.length === 1) {
    return <ReadyStateViewWaitingForOpponent />;
  }
  if (gameState === CONSTANTS.GAME_STATE_LOBBY) {
    return <ReadyStateView players={players} toggleReady={toggleReady} />;
  }
  return <Gameboard />;
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
