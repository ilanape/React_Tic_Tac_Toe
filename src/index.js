import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Board's child component
function Square(props) {
  return (
    <button 
    className="square" 
    onClick={props.onClick}
    >
    {props.value}
    </button>
  );
}

//Game's child component
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    //squares creation with for loops
    const size = 3;
    let squares = [];
    for(let i=0; i<size; i++){ //build by row
      let thisRow = [];
      for(let j=0; j<size; j++){
        thisRow.push(this.renderSquare((i*size) + j))
      }
      squares.push(
      <div 
        key={i} className="board-row"
      >
      {thisRow}
      </div>)
    }

    return ( <div>{squares}</div>);
  }
}

//parent component of all
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [ //stores the squares status in previous moves
        {
          squares: Array(9).fill(null), 
          moveSquare: null //the index of the square clicked on in this move
        }
      ], 
      stepNumber: 0,
      xIsNext: true
    };
  }

  //determins what to do on click
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); //ignores the moves that were after stepNumber, in case of 'going back in time'
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) { //returns if someone has won or if a square is already filled
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          moveSquare: i 
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  //sets the previous version (no. step) of the board
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0 //true if step number is even (the game begins with x)
    });
  }

  render() {
    const history = this.state.history; 
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //mapping the history of moves to the buttons on screen
    const moves = history.map((step, move) => { 
      const moveSquare = step.moveSquare
      //location calculation
      const row = Math.floor(moveSquare / 3) + 1;
      const col = (moveSquare % 3) + 1;

      const desc = move ?
        'Go to move #' + move + ' ('+col+','+row+')' :
        'Go to game start';
      return (
        //move number as the key - unique
        <li key={move}> 
          <button 
          onClick={() => this.jumpTo(move)}>
          {move == this.state.stepNumber ? <b>{desc} </b>: desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

//helper function to declaring a winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
