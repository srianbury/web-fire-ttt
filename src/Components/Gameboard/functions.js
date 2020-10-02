// put this function last in the gameover function so we know if we
// get to this step we don't have to check to see who won, just if it's full or not
function fullboard(board) {
  const winner = null;
  const winningSet = [];
  let gameover = true;

  board.forEach(square => {
    if (gameover && square === null) {
      gameover = false;
    }
  });

  return { gameover, winner, winningSet };
}

function rowWin(board) {
  if (board[0] === board[3] && board[3] === board[6] && board[6] !== null) {
    return { gameover: true, winner: board[0], winningSet: [0, 3, 6] };
  }

  if (board[1] === board[4] && board[4] === board[7] && board[7] !== null) {
    return { gameover: true, winner: board[1], winningSet: [1, 4, 7] };
  }

  if (board[2] === board[5] && board[5] === board[8] && board[8] !== null) {
    return { gameover: true, winner: board[2], winningSet: [2, 5, 8] };
  }

  return { gameover: false, winner: null, winningSet: [] };
}

function colWin(board) {
  if (board[0] === board[1] && board[1] === board[2] && board[2] !== null) {
    return { gameover: true, winner: board[0], winningSet: [0, 1, 2] };
  }

  if (board[3] === board[4] && board[4] === board[5] && board[5] !== null) {
    return { gameover: true, winner: board[3], winningSet: [3, 4, 5] };
  }

  if (board[6] === board[7] && board[7] === board[8] && board[8] !== null) {
    return { gameover: true, winner: board[6], winningSet: [6, 7, 8] };
  }

  return { gameover: false, winner: null, winningSet: [] };
}

function diagonalWin(board) {
  if (board[0] === board[4] && board[4] === board[8] && board[8] !== null) {
    return { gameover: true, winner: board[0], winningSet: [0, 4, 8] };
  }

  if (board[6] === board[4] && board[4] === board[2] && board[2] !== null) {
    return { gameover: true, winner: board[6], winningSet: [2, 4, 6] };
  }

  return { gameover: false, winner: null, winningSet: [] };
}

function gameover(board) {
  let response;

  response = rowWin(board);
  if (response.gameover) {
    return response;
  }

  response = colWin(board);
  if (response.gameover) {
    return response;
  }

  response = diagonalWin(board);
  if (response.gameover) {
    return response;
  }

  return fullboard(board);
}

export { fullboard, rowWin, colWin, diagonalWin, gameover };
