const board = document.querySelector(".board");
const squares = document.querySelectorAll(".square");
const restart = document.querySelector(".restart");
const scoresWrapper = document.querySelector(".scores");
const swap = document.querySelector(".swap");
const player1Score = document.querySelector(".player1 .score");
const player2Score = document.querySelector(".player2 .score");
const tiesScore = document.querySelector(".ties .score");
const turn1 = document.querySelector(".player1");
const turn2 = document.querySelector(".player2");
const turnTies = document.querySelector(".ties");

const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let player1Stats = { player1: 0, player2: 0, ties: 0 };
let player2Stats = { player1: 0, player2: 0, ties: 0 };
let cells = new Array(9).fill(0);
let currentPlayer = "x";
let otherPlayer = "o";
let isGameOver = false;
let isPlayerTurn = true;
let useAltStats = false;
const delay = 300;

function switchStats() {
  useAltStats = !useAltStats;
  scoresWrapper.classList.toggle("p1", !useAltStats);
  scoresWrapper.classList.toggle("p2", useAltStats);

  const stats = useAltStats ? player2Stats : player1Stats;
  player1Score.textContent = stats.player1;
  player2Score.textContent = stats.player2;
  tiesScore.textContent = stats.ties;

  isGameOver = false;
  resetGame();
}

function markCell(symbol, index) {
  squares[index].querySelector("div").classList.add(symbol);
}


function handleWin(winner, combo) {
  restart.style.display = "block";
  setTimeout(() => {
    setTimeout(() => isGameOver = false, delay);

    if (combo) {
      combo.forEach(i => squares[i].classList.add("win"));
    }

    const stats = useAltStats ? player2Stats : player1Stats;
    const target = winner === currentPlayer ? player1Score : player2Score;

    if (winner === currentPlayer) {
      stats.player1++;
      target.textContent = stats.player1;
      target.classList.add("appear");
      board.classList.add("win");
    } else if (winner === otherPlayer) {
      stats.player2++;
      target.textContent = stats.player2;
      target.classList.add("appear");
      board.classList.add("win");
    } else {
      stats.ties++;
      tiesScore.textContent = stats.ties;
      tiesScore.classList.add("appear");
      board.classList.add("tie");
    }
  }, (isPlayerTurn && !useAltStats) ? 100 : delay + 100);
}

function checkWinner() {
  for (const combo of winCombos) {
    const sum = combo.reduce((acc, i) => acc + cells[i], 0);
    if (sum === 3 || sum === -3) {
      handleWin(sum === 3 ? otherPlayer : currentPlayer, combo);
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
        markCell(otherPlayer, i);
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
    markCell(otherPlayer, bestMove);
    checkWinner();
  }
}

function evaluateBoard() {
  return Math.random();
}

function playerMove(index) {
  if (cells[index] !== 0 || checkWinner() || (!useAltStats && isPlayerTurn)) return;

  if (useAltStats) {
    isPlayerTurn = !isPlayerTurn;
    cells[index] = isPlayerTurn ? -1 : 1;
    markCell(isPlayerTurn ? currentPlayer : otherPlayer, index);
    checkWinner();
  } else {
    cells[index] = -1;
    markCell(currentPlayer, index);
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
  player1Score.classList.remove("appear");
  player2Score.classList.remove("appear");
  tiesScore.classList.remove("appear");

  isPlayerTurn = useAltStats ? !isPlayerTurn : true;

  if (!useAltStats && isPlayerTurn) setTimeout(botMove, delay);
}

document.addEventListener("DOMContentLoaded", () => {
  squares.forEach((square, index) => {
    square.addEventListener("click", () => playerMove(index));
  });

  restart.addEventListener("click", resetGame);
  restart.addEventListener("touchend", resetGame);
  scoresWrapper.addEventListener("click", switchStats);
  scoresWrapper.addEventListener("touchend", switchStats);
});  