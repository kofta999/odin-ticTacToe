const readline = require("readline/promises");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const GameBoard = (() => {
  const board = new Array(9);
  const getBoard = () => board;
  const mark = (x, symbol) => {
    // if place is taken
    if (board[x] != undefined) return null;
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
    for (let i = 0; i < 7; i++) {
      if (i === 4 || i === 5) continue;

      if (
        (board[i] === board[i + 1] && board[i + 1] === board[i + 2]) ||
        (board[i] === board[i + 3] && board[i + 3] === board[i + 6]) ||
        (i === 0 &&
          board[i] === board[i + 4] &&
          board[i + 4] === board[i + 8]) ||
        (i === 2 &&
          board[i + 2] === board[i + 4] &&
          board[i + 4] === board[i + 6])
      ) {
        // winner
        return board[i];
      }
    }
    return null;
  };

  const playRound = async () => {
    let i = 0;
    let symbol = "";
    do {
      if (i % 2 === 0) {
        // x turn
        symbol = "x";
        console.log("X turn");
      } else {
        // o turn
        symbol = "o";
        console.log("O turn");
      }
      const place = await rl.question("Add place: ");

      const marked = GameBoard.mark(place, symbol);
      // invalid input
      if (!marked) continue;
      const win = Game.decideWinner();
      if (win) return `The winner is ${win}`;
    } while (i++ < 9);

    return "It's a tie";
  };
  return { decideWinner, playRound };
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

const p1 = createPlayer("zby", "x");
const p2 = createPlayer("zby2", "y");

const main = async () => {
  console.log(await Game.playRound());
};

main();
