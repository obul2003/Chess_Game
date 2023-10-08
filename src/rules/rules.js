import { COLOR } from "../assets/colorAndPieces";
import checkAvailable from "../move/move";
import king from "../move/king";
import { makeMove } from "../move/move";
export const checkPawnEvolution = (
  board,
  start,
  targetRow,
  targetCol,
  player
) => {
  if (start[0] === 1) {
    const pawnColor = COLOR[start[1]];

    if (pawnColor === player) {
      if (targetRow === 0) {
        board[targetRow][targetCol] = [5, start[1]];
      }
    } else {
      if (targetRow === 7) {
        board[targetRow][targetCol] = [5, start[1]];
      }
    }
  }
  return board;
};

export const isCheckSafe = (board, player, color) => {
  // find king's position

  var kingIndex;
  loop1: for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      const piece = board[row][col];

      if (piece === 0) {
        continue;
      }

      if (piece[1] === color && piece[0] === 6) {
        kingIndex = [row, col];
        break loop1;
      }
    }
  }

  // check enemy's available moves are aiming our king

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      if (isCheckHelper(board, row, col, color, kingIndex, player)) {
        // not safe
        return false;
      }
    }
  }

  return true;
};

const isCheckHelper = (board, row, col, color, kingIdx, player) => {
  const piece = board[row][col];
  // piece is not blank and color is different
  if (piece !== 0 && piece[1] !== color) {
    const availableMoves = checkAvailable(
      row,
      col,
      board,
      [],
      player,
      "notMain"
    );
    for (let move of availableMoves) {
      //check
      if (move[0] === kingIdx[0] && move[1] === kingIdx[1]) {
        // it is check
        return true;
      }
    }
  }
  return false;
};

// checkmate
export const isCheckMate = (board, color, player) => {
  if (isCheckSafe(board, player, color)) {
    return false;
  }
  // 1. check are all king's moves included in enemy's move
  // get kingIdx
  let kingIdx = findKindIndex(board, color);

  const row = kingIdx[0];
  const col = kingIdx[1];

  const CannotDodge = canKingDodge(row, col, board, color, player);

  if (!CannotDodge) {
    return false;
  }
  // 2. check can any piece protect king by block the way or attack the enemy
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      const piece = board[r][c];
      if (piece !== 0 && piece[1] === color) {
        const moves = checkAvailable(r, c, board, [], player);
        for (let move of moves) {
          const targetRow = move[0];
          const targetCol = move[1];
          const newBoard = makeMove(targetRow, targetCol, r, c, board, player);
          const notCheck = isCheckSafe(newBoard, player, color);

          if (notCheck) {
            return false;
          }
        }
      }
    }
  }
  return true;
};

const canKingDodge = (row, col, board, color, player) => {
  // get all king's move
  const availableMoves = king(row, col, board, COLOR[color]);
  availableMoves.push([row, col]);
  // get enemy's all move
  const enemyMovesDict = {};
  const enemyMoves = Array.from(getEnemyMove(board, color, player));
  for (let move of enemyMoves) {
    enemyMovesDict[move] = true;
  }

  const same = [];
  for (let move of availableMoves) {
    if (enemyMovesDict[move] !== undefined) {
      same.push(move);
    }
  }
  // get intersection of enemyMoves and king's move
  // if intersection's length and king's move is same, king cannot dodge check
  // other piece should protect king or it is check mate

  const CannotDodge = same.length === availableMoves.length;

  if (!CannotDodge) {
    return false;
  }

  // check

  return true;
};

const getEnemyMove = (board, color, player) => {
  //color : number
  const enemyMoves = new Set();
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      const piece = board[row][col];
      if (piece !== 0 && piece[1] !== color) {
        const moves = checkAvailable(row, col, board, [], player);

        for (let move of moves) {
          enemyMoves.add(move);
        }
      }
    }
  }
  return enemyMoves;
};

const findKindIndex = (board, color) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      const piece = board[row][col];

      if (piece === 0) {
        continue;
      } else if (piece[0] === 6 && piece[1] === color) {
        return [row, col];
      }
    }
  }
};
