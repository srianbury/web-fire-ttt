import {
  fullboard,
  rowWin,
  colWin,
  diagonalWin,
  gameover
} from "./functions.js";

describe("Gameover Tests", () => {
  it("board is full", () => {
    const board = [
      "abc",
      "xyz",
      "abc",
      "xyz",
      "abc",
      "xyz",
      "xyz",
      "abc",
      "xyz"
    ];
    expect(fullboard(board)).toEqual({
      gameover: true,
      winner: null,
      winningSet: []
    });
  });

  it("board is not full", () => {
    const board = [null, null, null, null, null, null, null, null, null];
    expect(fullboard(board)).toEqual({
      gameover: false,
      winner: null,
      winningSet: []
    });
  });

  it("abc wins by left col", () => {
    const board = ["abc", null, "xyz", "abc", "xyz", null, "abc", null, null];
    expect(rowWin(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [0, 3, 6]
    });
  });

  it("abc wins by middle col", () => {
    const board = ["xyz", "abc", "xyz", null, "abc", null, null, "abc", null];
    expect(rowWin(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [1, 4, 7]
    });
  });

  it("abc wins by right col", () => {
    const board = [null, null, "abc", null, null, "abc", "xyz", "xyz", "abc"];
    expect(rowWin(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [2, 5, 8]
    });
  });

  it("abc wins by top row", () => {
    const board = ["abc", "abc", "abc", "xyz", "xyz", null, null, null, null];
    expect(colWin(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [0, 1, 2]
    });
  });

  it("abc wins by middle row", () => {
    const board = ["xyz", "xyz", null, "abc", "abc", "abc", null, null, null];
    expect(colWin(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [3, 4, 5]
    });
  });

  it("abc wins by bottom row", () => {
    const board = [null, null, null, null, "xyz", "xyz", "abc", "abc", "abc"];
    expect(colWin(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [6, 7, 8]
    });
  });

  it("abc wins diagonal top left to bottom right", () => {
    const board = ["abc", null, "xyz", null, "abc", "xyz", null, null, "abc"];
    expect(diagonalWin(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [0, 4, 8]
    });
  });

  it("abc wins diagonal bottom left to top right", () => {
    const board = [null, null, "abc", null, "abc", null, "abc", null, null];
    expect(diagonalWin(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [2, 4, 6]
    });
  });

  it("not gameoever", () => {
    const board = [null, null, null, null, null, null, null, null, null];
    expect(gameover(board)).toEqual({
      gameover: false,
      winner: null,
      winningSet: []
    });
  });

  it("tie game", () => {
    const board = [
      "abc",
      "xyz",
      "abc",
      "xyz",
      "abc",
      "xyz",
      "xyz",
      "abc",
      "xyz"
    ];
    expect(gameover(board)).toEqual({
      gameover: true,
      winner: null,
      winningSet: []
    });
  });

  it("abc wins top row", () => {
    const board = ["abc", "abc", "abc", "xyz", "xyz", null, null, null, null];
    expect(gameover(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [0, 1, 2]
    });
  });

  it("abc wins middle row", () => {
    const board = ["xyz", "xyz", null, "abc", "abc", "abc", null, null, null];
    expect(gameover(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [3, 4, 5]
    });
  });

  it("abc wins bottom row", () => {
    const board = [null, null, null, null, "xyz", "xyz", "abc", "abc", "abc"];
    expect(gameover(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [6, 7, 8]
    });
  });

  it("abc wins left col", () => {
    const board = ["abc", null, "xyz", "abc", "xyz", null, "abc", null, null];
    expect(gameover(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [0, 3, 6]
    });
  });

  it("abc wins middle col", () => {
    const board = ["xyz", "abc", "xyz", null, "abc", null, null, "abc", null];
    expect(gameover(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [1, 4, 7]
    });
  });

  it("abc wins right col", () => {
    const board = [null, null, "abc", null, null, "abc", "xyz", "xyz", "abc"];
    expect(gameover(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [2, 5, 8]
    });
  });

  it("abc wins diagonal top left to bottom right", () => {
    const board = ["abc", null, "xyz", null, "abc", "xyz", null, null, "abc"];
    expect(gameover(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [0, 4, 8]
    });
  });

  it("abc wins diagonal bottom left to top right", () => {
    const board = [null, null, "abc", null, "abc", null, "abc", null, null];
    expect(gameover(board)).toEqual({
      gameover: true,
      winner: "abc",
      winningSet: [2, 4, 6]
    });
  });
});
