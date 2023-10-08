import { getAvailableMoves } from "./move";

const rook = (r, c, board, color) => {
  let availableMoves = [];
  const checks = ["cross"];

  availableMoves = getAvailableMoves(
    r,
    c,
    board,
    color,
    availableMoves,
    checks
  );

  return availableMoves;
};

export default rook;
