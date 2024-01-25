const container = document.querySelector(".container");
let i = 0;

const GameBoard = (() => {
  const board = new Array(9);
  const getBoard = () => board;
  const mark = (x, symbol) => {
    // if place is taken
    if (board[x] != undefined) throw new Error("Already taken");
    if (symbol.toLowerCase() !== "x" && symbol.toLowerCase() !== "o")
      return null;

    // from 0 ~ 8
    board[x] = symbol;
  };

  const reset = () => {
    board.fill(undefined);
  };

  // add display board on page
  // add reset board

  return { mark, getBoard, reset };
})();

const Game = (() => {
  const board = GameBoard.getBoard();
  const decideWinner = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
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
  };
  return { decideWinner, playRound };
})();

const DisplayController = (() => {
  const board = document.createElement("div");

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
      if (win || i === 9) displayWinner(player);
      i++;
    } catch (e) {
      alert(e.message);
    }
  };

  const displayWinner = (player) => {
    const message = document.createElement("h2");

    message.textContent =
      i !== 9 ? `The winner is ${player.getPlayerName()}!` : "It's a tie";

    container.appendChild(message);
  };

  const displayBoard = () => {
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
    board.remove();
    displayBoard();
    document.querySelector("h2").remove();
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

const p1 = createPlayer("zby", "X");
const p2 = createPlayer("zby2", "O");

DisplayController.displayBoard();
Game.playRound(p1, p2);
