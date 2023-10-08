import React from "react";
import PIECES_IMAGE from "../assets/img";
import "./Pieces.css";
const PIECES = {
  0: "None",
  1: "pawn",
  2: "bishop",
  3: "kight",
  4: "rook",
  5: "queen",
  6: "king"
};

const COLOR = {
  0: "black",
  1: "white"
};
class Pieces extends React.Component {
  constructor(props) {
    super();
  }

  // function that get color and kind element from colorKind props
  makeColorKind = () => {
    if (this.props.colorKind !== 0) {
      this.color = COLOR[this.props.colorKind[1]];
      this.kind = PIECES[this.props.colorKind[0]];
    } else {
      this.kind = PIECES[this.props.colorKind];
    }
  };

  // get image using kind and color elements
  getImage = () => {
    if (this.kind !== "None") {
      this.image = PIECES_IMAGE[this.kind][this.color];

      return <img src={this.image} alt="" />;
    } else {
      return;
    }
  };

  // make ClassName for background color
  getColorClass = () => {
    let SquareClass = "Square";
    if (this.props.available) {
      SquareClass = SquareClass + " available";
      return SquareClass;
    }
    if ((this.props.row + this.props.col) % 2 === 1) {
      SquareClass = SquareClass + " black";
    } else {
      SquareClass = SquareClass + " white";
    }

    return SquareClass;
  };

  render() {
    const PieceClass = this.getColorClass();
    this.makeColorKind();

    return (
      <button onClick={() => this.props.clicked()} className={PieceClass}>
        {this.getImage()}
      </button>
    );
  }
}

export default Pieces;
