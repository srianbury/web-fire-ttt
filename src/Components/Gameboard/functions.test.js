import { fullboard, rowWin, colWin, diagonalWin } from "./functions.js";

describe("Gameover Tests", () => {
  it("board is full", () => {
    const board = [
      "abc",
      "xyz",
      "abc",
      "xyz",
      "abc",
      "xyz",
      "abc",
      "xyz",
      "abc"
    ];
    expect(fullboard(board)).toEqual(true);
  });

  it("board is not full", () => {
    const board = [null, null, null, null, null, null, null, null, null];
    expect(fullboard(board)).toEqual(false);
  });

  it("abc wins by left row", () => {
    const board = ["abc", null, "xyz", "abc", "xyz", null, "abc", null, null];
    expect(rowWin(board)).toBe(true);
  });

  it("abc wins by middle row", () => {
    const board = ["xyz", "abc", "xyz", null, "abc", null, null, "abc", null];
    expect(rowWin(board)).toBe(true);
  });

  it("abc wins by right row", () => {
    const board = [null, null, "abc", null, null, "abc", "xyz", "xyz", "abc"];
    expect(rowWin(board)).toBe(true);
  });

  it("abc wins by top col", () => {
    const board = ["abc", "abc", "abc", "xyz", "xyz", null, null, null, null];
    expect(colWin(board)).toBe(true);
  });

  it("abc wins by middle col", () => {
    const board = ["xyz", "xyz", null, "abc", "abc", "abc", null, null, null];
    expect(colWin(board)).toBe(true);
  });

  it("abc wins by bottom col", () => {
    const board = [null, null, null, null, "xyz", "xyz", "abc", "abc", "abc"];
    expect(colWin(board)).toBe(true);
  });

  it("abc wins diagonal top left to bottom right", () => {
    const board = ["abc", null, "xyz", null, "abc", "xyz", null, null, "abc"];
    expect(diagonalWin(board)).toBe(true);
  });

  it("abc wins diagonal bottom left to top right", () => {
    const board = [null, null, "abc", null, "abc", null, "abc", null, null];
    expect(diagonalWin(board)).toBe(true);
  });
});
