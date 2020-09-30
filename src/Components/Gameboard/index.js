import React, { useContext } from "react";
import { MatchContext } from "../Match";
import AuthenticationContext from "../Authentication";
import FirebaseContext from "../FirebaseContext";
import { fullboard, rowWin, colWin, diagonalWin } from "./functions";

import "./index.css";

const GameboardContainer = () => {
  return (
    <div>
      <TurnContainer />
      <GameboardView />
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
  const { board } = value;

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
