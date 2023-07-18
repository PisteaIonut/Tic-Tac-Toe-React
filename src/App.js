import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Board />
    </div>
  );
}
function isBoardFull(squares) {
  return squares.every((square) => square !== null);
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  // const [xIsNext, setXIsNext] = useState(true);
  // const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner && winner.winner) {
    status = "Winner: " + winner.winner;
  } else {
    if (isBoardFull(squares)) {
      status = "It's a draw!";
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

  return (
    // <>
    //   <div className="status">{status}</div>
    //   <div className="board-row">
    //     <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
    //     <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
    //     <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
    //   </div>
    //   <div className="board-row">
    //     <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
    //     <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
    //     <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
    //   </div>
    //   <div className="board-row">
    //     <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
    //     <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
    //     <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
    //   </div>
    // </>
    <>
      <div className="status">{status}</div>
      {Array(3)
        .fill(null)
        .map((_, row) => (
          <div className="board-row" key={row}>
            {Array(3)
              .fill(null)
              .map((_, col) => {
                const squareIndex = row * 3 + col;
                return (
                  <Square
                    key={squareIndex}
                    value={squares[squareIndex]}
                    onSquareClick={() => handleClick(squareIndex)}
                    isWinning={winningSquares.includes(squareIndex)}
                  />
                );
              })}
          </div>
        ))}
    </>
  );
}

function Square({ value, onSquareClick, isWinning }) {
  const classNames = "square" + (isWinning ? " winning-square" : "");
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [sortAscending, setSortAscending] = useState(true);

  function handlePLay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // const moves = history.map((squares, move) => {
  //   const step = sortAscending ? move : history.length - 1 - move;
  //   const description = step > 0 ? `Go to move #${step}` : "Go to game start";
  //   return (
  //     <li key={step}>
  //       <button onClick={() => jumpTo(step)}>{description}</button>
  //     </li>
  //   );
  // });
  const moves = history.map((squares, move) => {
    const step = sortAscending ? move : history.length - 1 - move;
    const description = step > 0 ? `Go to move #${step}` : "Go to game start";

    // Calculate the row and column for the current move
    const row = Math.floor(move / 3);
    const col = move % 3;
    const location = `(row: ${row}, col: ${col})`;

    return (
      <li key={step}>
        <button onClick={() => jumpTo(step)}>
          {description} {location}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePLay}
          winningSquares={calculateWinner(currentSquares)?.winningSquares || []}
        />
      </div>
      <div className="game-info">
        <div>
          <button onClick={() => setSortAscending(!sortAscending)}>
            Sort Order: {sortAscending ? "Ascending" : "Descending"}
          </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
