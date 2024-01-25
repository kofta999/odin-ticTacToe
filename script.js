const container = document.querySelector(".container");
const form = document.querySelector("form");
let i = 0;
let p1, p2;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);

  const p1Name = data.get("player1") || "Player 1";
  const p2Name = data.get("player2") || "Player 2";

  p1 = createPlayer(p1Name, "X");
  p2 = createPlayer(p2Name, "O");

  Game.playRound(p1, p2);
});

const GameBoard = (() => {
  const board = new Array(9);
  const get = () => board;
  const mark = (x, symbol) => {
    if (board[x] != undefined) throw new Error("Already taken");
    if (symbol.toLowerCase() !== "x" && symbol.toLowerCase() !== "o")
      return null;

    board[x] = symbol;
  };

  const reset = () => {
    board.fill();
  };

  return { mark, get, reset };
})();

const Game = (() => {
  const board = GameBoard.get();
  const decideWinner = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 9],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 9],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[b] === board[c])
        return true;
    }

    return false;
  };

  const playRound = () => {
    DisplayController.resetBoard();
    DisplayController.displayBoard();
  };

  return { decideWinner, playRound };
})();

const DisplayController = (() => {
  let board;

  const handleClick = (e) => {
    const box = e.target;
    const index = box.getAttribute("data-index");
    const player = i % 2 === 0 ? p1 : p2;

    try {
      const symbol = player.getPlayerSymbol();
      GameBoard.mark(index, symbol);
      box.textContent = symbol;
      const win = Game.decideWinner();
      console.log(win, i === 9);
      if (win || i === 9) {
        displayWinner(player);
        // make it dimmer
        board.style.opacity = "0.5";
        board.style.pointerEvents = "none";
        displayResetButton();
      }
      i++;
    } catch (e) {
      alert(e.message);
    }
  };

  const displayResetButton = () => {
    const reset = document.createElement("button");
    reset.id = "reset";
    reset.classList.add("btn");
    reset.textContent = "Play Again";
    reset.addEventListener("click", Game.playRound);
    container.appendChild(reset);
  };

  const displayWinner = (player) => {
    const message = document.createElement("h2");

    message.textContent =
      i !== 9 ? `The winner is ${player.getPlayerName()}!` : "It's a tie";

    container.appendChild(message);
  };

  const displayBoard = () => {
    board = document.createElement("div");
    board.classList.add("board");

    const boxes = new Array(9).fill().map((_, i) => {
      const box = document.createElement("div");
      box.classList.add("box");
      box.setAttribute("data-index", i);
      box.addEventListener("click", handleClick);
      return box;
    });

    boxes.forEach((box) => board.appendChild(box));

    container.appendChild(board);
  };

  const resetBoard = () => {
    document.querySelector(".board")?.remove();
    GameBoard.reset();
    document.querySelector("h2")?.remove();
    document.querySelector("#reset")?.remove();
    i = 0;
  };

  return { displayBoard, resetBoard };
})();

const createPlayer = (name, symbol) => {
  const player = { name, symbol };

  const getPlayerSymbol = () => player.symbol;
  const getPlayerName = () => player.name;
  const setPlayerName = (name) => {
    player.name = name;
  };

  return { getPlayerName, getPlayerSymbol, setPlayerName };
};
