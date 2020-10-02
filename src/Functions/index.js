function getRandomFirstTurn(players) {
  return players[Math.round(Math.random())].uid;
}

function getRandomMark() {
  const options = ["X", "O"];
  return options[Math.round(Math.random())];
}

function getOppositeMark(opponentsMark) {
  return opponentsMark === "X" ? "O" : "X";
}

export { getRandomFirstTurn, getRandomMark, getOppositeMark };
