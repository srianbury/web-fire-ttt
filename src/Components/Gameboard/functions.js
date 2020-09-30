function fullboard(board) {
  let full = true;
  board.forEach(square => {
    if (full && square === null) {
      full = false;
    }
  });
  return full;
}

function rowWin(board) {
  return (
    (board[0] === board[3] && board[3] === board[6] && board[6] !== null) ||
    (board[1] === board[4] && board[4] === board[7] && board[7] !== null) ||
    (board[2] === board[5] && board[5] === board[8] && board[8] !== null)
  );
}

function colWin(board) {
  return (
    (board[0] === board[1] && board[1] === board[2] && board[2] !== null) ||
    (board[3] === board[4] && board[4] === board[5] && board[5] !== null) ||
    (board[6] === board[7] && board[7] === board[8] && board[8] !== null)
  );
}

function diagonalWin(board) {
  return (
    (board[0] === board[4] && board[4] === board[8] && board[8] !== null) ||
    (board[6] === board[4] && board[4] === board[2] && board[2] !== null)
  );
}

export { fullboard, rowWin, colWin, diagonalWin };
