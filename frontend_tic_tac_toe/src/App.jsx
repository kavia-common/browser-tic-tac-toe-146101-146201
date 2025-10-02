import React, { useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * App
 * The main application component for the Tic Tac Toe game.
 * Renders a minimalist header, the 3x3 game grid, a status indicator,
 * and a reset button. Applies the "Ocean Professional" theme.
 */
export default function App() {
  // Game state: 9 cells initialized to null
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Derive winner and status
  const winner = useMemo(() => calculateWinner(board), [board]);
  const isDraw = useMemo(() => board.every((c) => c !== null) && !winner, [board, winner]);

  // PUBLIC_INTERFACE
  /**
   * handleCellClick
   * Handles user interactions with a specific cell.
   * @param {number} index - Index of the cell clicked (0..8)
   */
  const handleCellClick = (index) => {
    // Ignore if cell occupied or game over
    if (board[index] || winner) return;
    const nextBoard = board.slice();
    nextBoard[index] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  /**
   * resetGame
   * Resets the board and active player to initial state.
   */
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a draw!"
    : `Next turn: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true" />
        <h1 className="app-title">Tic Tac Toe</h1>
        <p className="app-subtitle">Ocean Professional</p>
      </header>

      <main className="app-main">
        <section className="board-card" aria-label="Tic Tac Toe Board">
          <Board
            board={board}
            onCellClick={handleCellClick}
            highlight={winner ? winner.line : null}
          />

          <div className="status-row" role="status" aria-live="polite">
            <StatusBadge winner={winner?.player} isDraw={isDraw} next={xIsNext ? "X" : "O"} />
            <button
              type="button"
              className="reset-btn"
              onClick={resetGame}
              aria-label="Reset game"
            >
              Reset
            </button>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <small>Built with Vite + React</small>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board
 * Renders a 3x3 grid of cells.
 * @param {{board: (string|null)[], onCellClick: (index:number)=>void, highlight: number[] | null}} props
 */
function Board({ board, onCellClick, highlight }) {
  return (
    <div className="grid-3">
      {board.map((value, idx) => (
        <Cell
          key={idx}
          value={value}
          onClick={() => onCellClick(idx)}
          isHighlighted={highlight ? highlight.includes(idx) : false}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * ChessIcon
 * Renders an accessible chess icon for X (knight) or O (queen).
 * Uses Unicode pieces with ARIA labels for better accessibility.
 * @param {{kind: 'X'|'O'}} props
 */
function ChessIcon({ kind }) {
  const isX = kind === "X";
  const char = isX ? "♞" : "♛"; // Knight for X, Queen for O
  const label = isX ? "Knight" : "Queen";
  return (
    <span
      className={`cell-value ${isX ? "x" : "o"}`}
      role="img"
      aria-label={label}
      aria-hidden={false}
    >
      {char}
    </span>
  );
}

/**
 * PUBLIC_INTERFACE
 * Cell
 * Single cell in the Tic Tac Toe grid.
 * @param {{value: 'X' | 'O' | null, onClick: ()=>void, isHighlighted: boolean}} props
 */
function Cell({ value, onClick, isHighlighted }) {
  const ariaLabel =
    value === "X" || value === "O"
      ? `Cell contains ${value === "X" ? "Knight" : "Queen"}`
      : "Empty cell, click to place your mark";

  return (
    <button
      type="button"
      className={`cell ${value ? "filled" : ""} ${isHighlighted ? "highlight" : ""}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {value && <ChessIcon kind={value} />}
    </button>
  );
}

/**
 * Calculates the winner for a given 3x3 board.
 * @param {(string|null)[]} squares
 * @returns {null | {player: 'X'|'O', line: number[]}}
 */
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * StatusBadge
 * Displays current game status (winner/draw/next).
 * @param {{winner?: 'X'|'O', isDraw: boolean, next: 'X'|'O'}} props
 */
function StatusBadge({ winner, isDraw, next }) {
  const renderIcon = (mark) => (mark ? <ChessIcon kind={mark} /> : null);

  if (winner) {
    return (
      <div className="status-badge win" data-testid="status">
        Winner: <strong className="status-strong-icon">{renderIcon(winner)}</strong>
      </div>
    );
  }
  if (isDraw) {
    return (
      <div className="status-badge draw" data-testid="status">
        It's a draw!
      </div>
    );
  }
  return (
    <div className="status-badge next" data-testid="status">
      Next turn: <strong className="status-strong-icon">{renderIcon(next)}</strong>
    </div>
  );
}
