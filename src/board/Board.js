import "./Board.css";
import React from "react";
import checkAvailable from "../move/move";
import Pieces from "../pieces/Pieces";
import board from "../assets/initialBoard";
import Minimax from "../AI/Minimax";
import RandomMoveAI from "../AI/RandomMove";

//import rules from "../rules/rules";
import { makeMove } from "../move/move";
class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      previousBoard: board,
      turn: "white",
      board: board,
      player: "black",
      availableMoves: [],
      currentRowCol: [],
      title: "white's turn",
      gameStatus: true,
      whiteCatched: [],
      blackCatched: [],
      AImode: false,
      AI: null,
      showOverlay: false
    };
  }

  BOARDLEN = 8;
  AI = ["Random", "Minimax"];
  // get row and col value of piece
  pieceClickedHandler = (r, c, isAvailable) => {
    // check game is end
    if (!this.state.gameStatus) {
      return;
    }
    let turn = this.state.turn;
    // get current col and row
    const curRowCol = this.state.currentRowCol;
    // if current row and col are exist get
    if (curRowCol.length !== 0) {
      var curRow = curRowCol[0];
      var curCol = curRowCol[1];
    } else {
      // when it is new move
      // check player is following the right turn
      if (!this.checkTurn(r, c, turn)) {
        return;
      }

      // update curRowCol if it is right turn
      const available = checkAvailable(
        r,
        c,
        this.state.board,
        this.state.previousBoard,
        this.state.player,
        "main"
      );
      if (available === undefined || available.length === 0) {
        this.changeTitle("Player should move another piece!", "red", true);
      } else {
        this.changeTitle(turn + "'s turn", "white", true);
      }
      this.setState({ currentRowCol: [r, c], availableMoves: available });
      return;
    }

    // make new available move when player decided clicked not available spot
    if (!isAvailable) {
      if (!this.checkTurn(r, c, turn)) {
        return;
      }
      const available = checkAvailable(
        r,
        c,
        this.state.board,
        this.state.previousBoard,
        this.state.player,
        "main"
      );
      if (available === undefined || available.length === 0) {
        this.changeTitle("Player should move another piece!", "red", true);
      } else {
        this.changeTitle(turn + "'s turn", "white", true);
      }
      this.setState({ availableMoves: available, currentRowCol: [r, c] });
    } else {
      // make a move and update
      let title = this.state.title;

      turn === "black" ? (turn = "white") : (turn = "black");
      title = turn + "'s turn";
      document.documentElement.style.setProperty("--titleColor", "white");
      this.setState({ title: title });
      this.setState({ previousBoard: this.state.board });
      this.setState({
        board: makeMove(
          r,
          c,
          curRow,
          curCol,
          this.state.board,
          this.state.player,
          "main",
          this.changeTitle,
          this.updateBoard
        ),
        availableMoves: [],
        turn: turn,
        currentRowCol: []
      });
    }
  };

  changeTitle = (title, titleColor, gameStatus) => {
    document.documentElement.style.setProperty("--titleColor", titleColor);
    this.setState({ title: title, gameStatus: gameStatus });
  };

  checkTurn = (r, c, turn) => {
    const piece = this.state.board[r][c];
    if (piece !== 0) {
      const color = piece[1] === 1 ? "white" : "black";
      if (color !== turn) {
        // just return it if it is wrong turn
        return false;
      }
    }
    return true;
  };

  // get game status

  getGameStatus = () => {
    return this.state.gameStatus;
  };

  // // copy board
  // copyBoard = () => {
  //   const copyBoard = [...this.state.board];
  //   return copyBoard;
  // };
  //check row and col is in available move
  checkRowColInAvailableMoves(row, col) {
    if (!this.state.availableMoves) {
      return false;
    }
    for (let move = 0; move < this.state.availableMoves.length; move++) {
      const r = this.state.availableMoves[move][0];
      const c = this.state.availableMoves[move][1];
      if (row === r && col === c) {
        return true;
      }
    }
    return false;
  }

  // make new game
  newGame() {
    document.documentElement.style.setProperty("--titleColor", "white");
    let newBoard;
    const player = this.state.player;
    if (player === "white") {
      newBoard = this.rotateBoard(board);
    } else {
      newBoard = board;
    }
    this.setState({
      previousBoard: newBoard,
      turn: "white",
      board: newBoard,
      player: player,
      availableMoves: [],
      currentRowCol: [],
      title: "white's turn",
      gameStatus: true,
      whiteCatched: [],
      blackCatched: []
    });
  }

  //rotate board
  rotateBoard(board) {
    let ret = [...Array(8)].map((e) => Array(8));
    for (let i = 0; i < board.length; ++i) {
      for (let j = 0; j < board.length; ++j) {
        ret[i][board.length - 1 - j] = board[board.length - 1 - i][j];
      }
    }

    return ret;
  }
  // change player
  changePlayer(e) {
    const playerToChange = e.target.innerText.toLowerCase();
    if (playerToChange === this.state.player) {
      alert("nothing to change");
      return;
    }
    let newBoard;
    if (playerToChange === "white") {
      newBoard = this.rotateBoard(board);
    } else {
      newBoard = board;
    }

    const player = this.state.player;
    this.setState({
      previousBoard: newBoard,
      turn: "white",
      board: newBoard,
      player: playerToChange,
      availableMoves: [],
      currentRowCol: [],
      title: player + "'s turn",
      gameStatus: true,
      whiteCatched: [],
      blackCatched: []
    });
  }

  // function that render a board
  renderBoard = () => {
    return this.state.board.map((row, r) =>
      row.map((element, c) => (
        <Pieces
          clicked={() =>
            this.pieceClickedHandler(
              r,
              c,
              this.checkRowColInAvailableMoves(r, c)
            )
          }
          key={(r, c)}
          row={r}
          col={c}
          colorKind={this.state.board[r][c]}
          available={this.checkRowColInAvailableMoves(r, c)}
        />
      ))
    );
  };

  overLayClicked = () => {
    this.setState({ showOverlay: false });
  };

  AITypeButtonClicked = (e) => {
    this.setState({ AI: e.target.innerText, AImode: !this.state.AImode });
  };

  AITurn = () => {
    const AIType = this.state.AI;
    let nextTurn;
    this.state.turn === "white" ? (nextTurn = "black") : (nextTurn = "white");
    let newBoard;
    let AIColorNum;
    this.state.turn === "white" ? (AIColorNum = 1) : (AIColorNum = 0);
    if (AIType === "Random") {
      newBoard = RandomMoveAI(
        this.state.board,
        this.state.previousBoard,
        AIColorNum,
        this.state.player,
        this.changeTitle
      );
    } else if (AIType === "Minimax") {
      newBoard = Minimax(
        3,
        this.state.board,
        this.state.previousBoard,
        AIColorNum,
        this.state.player,
        AIColorNum,
        this.changeTitle
      );
    }

    this.setState({ previousBoard: this.state.board });
    this.setState({
      board: newBoard,
      turn: nextTurn,
      title: nextTurn + "'s turn"
    });
  };

  AImodeButtonClicked = () => {
    if (!this.state.AImode) {
      this.setState({ showOverlay: true });
    } else {
      this.setState({ AImode: false });
    }
    this.newGame();
  };

  render() {
    // title
    const title = this.state.title;

    // if game is not finished, aI mode and ai's turn make ai move
    if (
      this.state.gameStatus &&
      this.state.player !== this.state.turn &&
      this.state.AImode
    ) {
      this.AITurn();
      if (this.state.gameStatus) {
        let turn = "";
        this.state.turn === "white" ? (turn = "black") : (turn = "white");
        this.changeTitle(turn + "'s turn", "white", true);
      }
    }

    // button title
    let AIButtonTitle;
    this.state.AImode
      ? (AIButtonTitle = "Normal Mode")
      : (AIButtonTitle = "AI Mode");

    // overlay
    let overlay;
    if (this.state.showOverlay) {
      overlay = (
        <div onClick={() => this.overLayClicked()} className="overlay">
          <button
            onClick={(e) => this.AITypeButtonClicked(e)}
            className="blueButton overlayButton"
          >
            Random
          </button>
          <button
            onClick={(e) => this.AITypeButtonClicked(e)}
            className="blueButton overlayButton"
          >
            Minimax
          </button>
        </div>
      );
    } else {
      overlay = "";
    }

    // AI and Player className
    let AIClass = "hidden";
    let playerClass = "hidden";
    if (this.state.AImode) {
      AIClass = "ai";
      playerClass = "player";
    }

    return (
      <html>
        <body className="header">
          {overlay}
          <h1>Chess</h1>
          <p className="title">{title}</p>
          <div className="game">
            <div className={AIClass}>
              <p>AI</p>
            </div>

            <div className="wrapper">{this.renderBoard()}</div>

            <div className={playerClass}>
              <p>Player</p>
            </div>
          </div>
          <div className="buttons">
            <button
              className="blueButton"
              onClick={(e) => this.changePlayer(e)}
            >
              White
            </button>
            <button
              className="blueButton"
              onClick={(e) => this.changePlayer(e)}
            >
              Black
            </button>
            <button className="blueButton" onClick={() => this.newGame()}>
              New Game
            </button>
            <button
              className="blueButton"
              onClick={() => this.AImodeButtonClicked()}
            >
              {AIButtonTitle}
            </button>
          </div>
        </body>
      </html>
    );
  }
}

export default Board;
