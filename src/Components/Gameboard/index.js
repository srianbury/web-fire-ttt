import React, { useContext } from "react";
import { MatchContext } from "../Match";
import AuthenticationContext from "../Authentication";
import FirebaseContext from "../FirebaseContext";
import { fullboard, rowWin, colWin, diagonalWin } from "./functions";
import * as CONSTANTS from "../../Constants";

import "./index.css";

function bothPlayersAreReady(players) {
  let ready = true;
  players.forEach(player => {
    if (!player.ready) {
      ready = false;
    }
  });
  return ready;
}

const RematchContainer = () => {
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(AuthenticationContext);
  const { matchId, value } = useContext(MatchContext);
  const { board, players, gameState } = value;

  async function toggleReady() {
    const nextPlayersState = players.map(player => {
      if (player.uid !== user.uid) {
        return player;
      }
      return { ...player, ready: !player.ready };
    });
    console.log({ nextPlayersState });
    firebase
      .firestore()
      .collection("matches")
      .doc(matchId)
      .update({
        players: nextPlayersState
      });
  }

  if (gameover(board)) {
    if (
      bothPlayersAreReady(players) &&
      gameState === CONSTANTS.GAME_STATE_GAMEOVER
    ) {
      const nextPlayersState = players.map(player => ({
        ...player,
        ready: false
      }));
      firebase
        .firestore()
        .collection("matches")
        .doc(matchId)
        .update({
          gameState: CONSTANTS.GAME_STATE_PLAYING,
          board: [null, null, null, null, null, null, null, null, null],
          players: nextPlayersState
        });
    }
    return <RematchView players={players} toggleReady={toggleReady} />;
  }
  return null;
};

const RematchView = ({ players, toggleReady }) => (
  <div>
    <div>Rematch?</div>
    {players.map(player => (
      <RematchQuestionContainer
        key={player.uid}
        player={player}
        toggleReady={toggleReady}
      />
    ))}
  </div>
);

const RematchQuestionContainer = ({ player, toggleReady }) => {
  const { user } = useContext(AuthenticationContext);

  return (
    <div>
      <div>{player.isAnonymous ? "Anon" : player.displayName}</div>
      {user.uid === player.uid ? (
        <button type="button" onClick={toggleReady}>
          {player.ready ? "Cancel" : "Ready up"}
        </button>
      ) : (
        <div>{player.ready ? "Ready" : "Not Ready"}</div>
      )}
    </div>
  );
};

const GameboardContainer = () => {
  return (
    <div>
      <TurnContainer />
      <GameboardView />
      <RematchContainer />
    </div>
  );
};

const GameboardView = () => (
  <div>
    <div className="board-row">
      <SquareContainer index={0} />
      <SquareContainer index={1} />
      <SquareContainer index={2} />
    </div>
    <div className="board-row">
      <SquareContainer index={3} />
      <SquareContainer index={4} />
      <SquareContainer index={5} />
    </div>
    <div className="board-row">
      <SquareContainer index={6} />
      <SquareContainer index={7} />
      <SquareContainer index={8} />
    </div>
  </div>
);

const SquareContainer = ({ index, mark }) => {
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(AuthenticationContext);
  const { uid } = user;
  const { matchId, value } = useContext(MatchContext);
  const { board, gameState } = value;

  if (gameover(board) && gameState !== CONSTANTS.GAME_STATE_GAMEOVER) {
    firebase
      .firestore()
      .collection("matches")
      .doc(matchId)
      .update({
        gameState: CONSTANTS.GAME_STATE_GAMEOVER
      });
  }

  function onClick() {
    if (mark || value.turn !== uid || gameover(board)) {
      return;
    }

    const nextBoardState = value.board.map((square, squareIndex) => {
      if (squareIndex === index) {
        return uid;
      }
      return square;
    });

    const nextTurnState = value.players.find(player => player.uid !== uid).uid;

    firebase
      .firestore()
      .collection("matches")
      .doc(matchId)
      .update({
        board: nextBoardState,
        turn: nextTurnState
      });
  }

  return <SquareView onClick={onClick} mark={board[index]} uid={uid} />;
};
const SquareView = ({ onClick, mark, uid }) => (
  <button type="button" className="square" onClick={onClick}>
    {getSquareMark(mark, uid)}
  </button>
);

function getSquareMark(mark, uid) {
  if (!mark) {
    return "";
  }

  if (uid === mark) {
    return "X";
  }

  return "O";
}

const TurnContainer = () => {
  const { user } = useContext(AuthenticationContext);
  const { uid } = user;
  const { value } = useContext(MatchContext);
  const { turn } = value;

  return (
    <TurnView gameover={gameover(value.board)} isPlayersTurn={uid === turn} />
  );
};

const TurnView = ({ gameover, isPlayersTurn }) => (
  <div>
    {gameover
      ? "Gameover!"
      : isPlayersTurn
      ? "Your turn"
      : "Waiting for opponent"}
  </div>
);

function gameover(board) {
  return (
    fullboard(board) || rowWin(board) || colWin(board) || diagonalWin(board)
  );
}

export default GameboardContainer;
