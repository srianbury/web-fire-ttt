function getRandomTurn(players) {
  return players[Math.round(Math.random())].uid;
}

function bothPlayersAreReady(players) {
  let ready = true;
  players.forEach(player => {
    if (!player.ready) {
      ready = false;
    }
  });
  return ready;
}

function getRandomMark() {
  return Math.round(Math.random()) > 0.5 ? "X" : "O";
}

function getOppositeMark(opponent) {
  return opponent.mark === "X" ? "O" : "X";
}

export { getRandomTurn, bothPlayersAreReady, getRandomMark, getOppositeMark };
