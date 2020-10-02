function getRandomFirstTurn(players) {
  return players[Math.round(Math.random())].uid;
}

export { getRandomFirstTurn };
