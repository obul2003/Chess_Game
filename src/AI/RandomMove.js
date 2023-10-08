import { randomMove } from "./AI";

const randomMoveAI = (
  board,
  previousBoard,
  AIColorNum,
  player,
  changeTitle
) => {
  return randomMove(board, previousBoard, AIColorNum, player, changeTitle);
};

export default randomMoveAI;
