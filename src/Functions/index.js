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

function bothPlayersAreReady(players) {
  let ready = true;
  players.forEach(player => {
    if (!player.ready) {
      ready = false;
    }
  });
  return ready;
}

async function toggleReady(firebase, user, matchId) {
  const matchDocRef = firebase
    .firestore()
    .collection("matches")
    .doc(matchId);
  return firebase.firestore().runTransaction(async transaction => {
    const matchDoc = await transaction.get(matchDocRef);
    const nextPlayersState = matchDoc.data().players.map(player => {
      if (player.uid !== user.uid) {
        return player;
      }
      return { ...player, ready: !player.ready };
    });
    transaction.update(matchDocRef, { players: nextPlayersState });
  });
}

export {
  getRandomFirstTurn,
  getRandomMark,
  getOppositeMark,
  bothPlayersAreReady,
  toggleReady
};
