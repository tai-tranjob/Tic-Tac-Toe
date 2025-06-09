const board = document.querySelector(".board");
const squares = document.querySelectorAll(".square");
const restart = document.querySelector(".restart");
const switchScoreboard = document.querySelector(".scores");
const player1Score = document.querySelector(".player1 .score");
const player2Score = document.querySelector(".player2 .score");
const tiesScore = document.querySelector(".ties .score");

const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let player1Mode = { player1: 0, player2: 0, ties: 0 };
let player2Mode = { player1: 0, player2: 0, ties: 0 };
let cells = new Array(9).fill(0);
let playerX = "x";
let playerO = "o";
let isGameOver = false;
let isPlayerTurn = true;
let gameMode = false;
const delay = 300;

function switchMode() {
  gameMode = !gameMode;
  switchScoreboard.classList.toggle("p1", !gameMode);
  switchScoreboard.classList.toggle("p2", gameMode);

  const Mode = gameMode ? player2Mode : player1Mode;
  player1Score.textContent = Mode.player1;
  player2Score.textContent = Mode.player2;
  tiesScore.textContent = Mode.ties;

  isGameOver = false;
  resetGame();
}

function markCell(tick, location) {
  squares[location].querySelector("div").classList.add(tick);
}


function handleWin(winner, combo) {
  restart.style.display = "block";
  setTimeout(() => {
    setTimeout(() => isGameOver = false, delay);

    if (combo) {
      combo.forEach(i => squares[i].classList.add("win"));
    }

    const Mode = gameMode ? player2Mode : player1Mode;
    const target = winner === playerX ? player1Score : player2Score;

    if (winner === playerX) {
      Mode.player1++;
      target.textContent = Mode.player1;
      board.classList.add("win");
    } else if (winner === playerO) {
      Mode.player2++;
      target.textContent = Mode.player2;
      board.classList.add("win");
    } else {
      Mode.ties++;
      tiesScore.textContent = Mode.ties;
      board.classList.add("tie");
    }
  }, (isPlayerTurn && !gameMode) ? 100 : delay + 100);
}

function checkWinner() {
  for (const combo of winCombos) {
    const sum = combo.reduce((acc, i) => acc + cells[i], 0);
    if (sum === 3 || sum === -3) {
      handleWin(sum === 3 ? playerO : playerX, combo);
      return true;
    }
  }
  if (cells.every(cell => cell !== 0)) {
    handleWin(null);
    return true;
  }
  return false;
}

function botMove() {
  if (checkWinner()) return;

  isPlayerTurn = false;

  let bestMove = -1;
  let bestScore = -Infinity;

  for (let i = 0; i < 9; i++) {
    if (cells[i] === 0) {
      cells[i] = 1;
      if (checkWinner()) {
        markCell(playerO, i);
        return;
      }
      cells[i] = 0;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (cells[i] !== 0) continue;

    cells[i] = 1;
    let score = evaluateBoard();
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
    cells[i] = 0;
  }

  if (bestMove >= 0) {
    cells[bestMove] = 1;
    markCell(playerO, bestMove);
    checkWinner();
  }
}

function evaluateBoard() {
  return Math.random();
}

function playerMove(location) {
  if (cells[location] !== 0 || checkWinner() || (!gameMode && isPlayerTurn)) return;

  if (gameMode) {
    isPlayerTurn = !isPlayerTurn;
    cells[location] = isPlayerTurn ? -1 : 1;
    markCell(isPlayerTurn ? playerX : playerO, location);
    checkWinner();
  } else {
    cells[location] = -1;
    markCell(playerX, location);
    isPlayerTurn = true;
    setTimeout(botMove, delay);
  }

}

function resetGame() {
  isGameOver = true;
  restart.style.display = "none";
  cells.fill(0);
  squares.forEach(square => {
    square.classList.remove("win");
    square.querySelector("div").className = "";
  });
  board.classList.remove("win", "tie");

  isPlayerTurn = gameMode ? !isPlayerTurn : true;

  if (!gameMode && isPlayerTurn) setTimeout(botMove, delay);
}

document.addEventListener("DOMContentLoaded", () => {
  squares.forEach((square, location) => {
    square.addEventListener("click", () => playerMove(location));
  });

  restart.addEventListener("click", resetGame);
  switchScoreboard.addEventListener("click", switchMode);
});  