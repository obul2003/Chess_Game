import checkAvailable, { makeMove } from "../move/move";

export const getAllMoves = (board, previousBoard, colorNum, player) => {
  const allMoves = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      const piece = board[row][col];
      if (piece[1] === colorNum) {
        const moves = checkAvailable(
          row,
          col,
          board,
          previousBoard,
          player,
          "main"
        );
        allMoves.push([row, col, moves]);
      }
    }
  }
  return allMoves;
};

export const randomMove = (
  board,
  previousBoard,
  AIColorNum,
  player,
  changeTitle
) => {
  const allMovesOfEachPiece = getAllMoves(
    board,
    previousBoard,
    AIColorNum,
    player
  );

  const pieceNum = allMovesOfEachPiece.length;
  let newBoard;

  // make random move function
  while (true) {
    // while loop until make available move
    const randomPiece = Math.floor(Math.random() * pieceNum);

    // it is checkMate if no availableMove for all piece
    let checkMate = true;
    for (let piece of allMovesOfEachPiece) {
      const move = piece[2];
      if (move !== undefined && move.length !== 0) {
        checkMate = false;
        break;
      }
    }
    if (checkMate) {
      changeTitle("CheckMate! " + player + " win", "red", false);
    }

    const piece = allMovesOfEachPiece[randomPiece];

    const row = piece[0];
    const col = piece[1];
    const moves = piece[2];
    // if piece cannot move make new move
    if (moves === undefined || moves.length === 0) {
      continue;
    } else {
      const randomMove = Math.floor(Math.random() * moves.length);
      const move = moves[randomMove];
      const targetRow = move[0];
      const targetCol = move[1];
      newBoard = makeMove(
        targetRow,
        targetCol,
        row,
        col,
        board,
        player,
        "main",
        changeTitle
      );
    }

    break;
  }
  return newBoard;
};
