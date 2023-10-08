import { makeMove } from "../move/move";
import { getAllMoves } from "./AI";
import evaluationPositionTable from "../assets/evaluationTable";
import { PIECES } from "../assets/colorAndPieces";
const minimaxRoot = (
  depth,
  board,
  previousBoard,
  AIColorNum,
  player,
  turnColorNum,
  changeTitle
) => {
  let newTurnColorNum;
  turnColorNum === 1 ? (newTurnColorNum = 0) : (newTurnColorNum = 1);
  // get player of this turn's all moves
  const allMoves = getAllMoves(board, previousBoard, turnColorNum);
  shuffle(allMoves);
  // loop all moves
  let bestScore = -9999;
  let bestMove;

  for (let piece of allMoves) {
    const row = piece[0];
    const col = piece[1];
    const moves = piece[2];

    // if piece cannot move make new move
    if (moves === undefined || moves.length === 0) {
      continue;
    } else {
      let newBoard;
      // loop all move of a piece

      for (let move of moves) {
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

        let tempScore = minimax(
          depth - 1,
          newBoard,
          board,
          AIColorNum,
          player,
          newTurnColorNum,
          changeTitle
        );
        if (tempScore > bestScore) {
          bestScore = tempScore;
          bestMove = newBoard;
        }
      }
    }
  }

  return bestMove;
};

const minimax = (
  depth,
  board,
  previousBoard,
  AIColorNum,
  player,
  turnColorNum,
  changeTitle
) => {
  // update turn Color
  let newTurnColorNum;
  turnColorNum === 1 ? (newTurnColorNum = 0) : (newTurnColorNum = 1);

  // return board score when it reaches the end
  if (depth === 0) {
    const score = evaluateBoard(board, AIColorNum);

    return score;
  }

  // get player of this turn's all moves
  const allMoves = getAllMoves(board, previousBoard, turnColorNum);

  // it is checkMate if no availableMove for all piece
  let checkMate = true;
  for (let piece of allMoves) {
    const move = piece[2];
    if (move !== undefined && move.length !== 0) {
      checkMate = false;
      break;
    }
  }
  if (checkMate) {
    changeTitle("CheckMate! " + player + " win", "red", false);
  }

  // loop all moves
  for (let piece of allMoves) {
    const row = piece[0];
    const col = piece[1];
    const moves = piece[2];
    // if piece cannot move make new move
    if (moves === undefined || moves.length === 0) {
      continue;
    } else {
      let newBoard;
      // loop all move of a piece

      let bestScore;
      if (AIColorNum === turnColorNum) {
        // when AI's turn score should be maximized
        bestScore = -9999;
        for (let move of moves) {
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

          bestScore = Math.max(
            minimax(
              depth - 1,
              newBoard,
              board,
              AIColorNum,
              player,
              newTurnColorNum,
              changeTitle
            )
          );
        }
      } else {
        // player's turn score should be minimized
        bestScore = 9999;
        for (let move of moves) {
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

          bestScore = Math.min(
            minimax(
              depth - 1,
              newBoard,
              board,
              AIColorNum,
              player,
              newTurnColorNum,
              changeTitle
            )
          );
        }
      }
      return bestScore;
    }
  }
};

const evaluateBoard = (board, AIColorNum) => {
  //loop to evaluate

  let score = 0;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      score = score + evaluatePiece(board[row][col], AIColorNum, row, col);
    }
  }

  return score;
};

const evaluatePiece = (piece, AIColorNum, row, col) => {
  if (piece === 0) {
    return 0;
  }
  const element = piece[0];
  const color = piece[1];

  const evaluatePieceHelper = (element, row, col, color) => {
    const elementString = PIECES[element];
    let score = 0;
    if (element === 1) {
      // pawn
      score = 10;
    } else if (element === 2) {
      // bishop
      score = 30;
    } else if (element === 3) {
      //kight
      score = 30;
    } else if (element === 4) {
      //rook
      score = 50;
    } else if (element === 5) {
      //queen
      score = 90;
    } else if (element === 6) {
      score = 900;
    }
    if (color !== AIColorNum) {
      score = score + evaluationPositionTable[elementString][row][col];
    } else {
      score = score + reverse(evaluationPositionTable[elementString])[row][col];
    }

    return score;
  };
  let score = evaluatePieceHelper(element, row, col, color);

  if (AIColorNum === color) {
    return score;
  } else {
    return -score;
  }
};

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
}

function reverse(array) {
  return array.slice().reverse();
}

export default minimaxRoot;
