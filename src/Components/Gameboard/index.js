import React, { useContext } from "react";
import { MatchContext } from "../Match";
import AuthenticationContext from "../Authentication";

import "./index.css";

const GameboardContainer = () => {
  return <GameboardView />;
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
  const { user } = useContext(AuthenticationContext);
  const { uid } = user;
  const { value } = useContext(MatchContext);
  const { board } = value;

  function onClick() {
    if (mark) {
      return;
    }
    console.log({ index, mark });
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

export default GameboardContainer;
