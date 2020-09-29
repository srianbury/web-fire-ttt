import React, { useContext } from "react";
import { MatchContext } from "../Match";

const GameboardContainer = () => {
  const { matchId, value } = useContext(MatchContext);
  console.log({ value });
  return <div>Gameboard {matchId}</div>;
};

export default GameboardContainer;
