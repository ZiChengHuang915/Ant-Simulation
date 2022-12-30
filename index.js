const boardWidth = 400;
const boardHeight = 400;
const board_border = 'black';
const board_background = "white";

const board = document.getElementById("board");
const boardContext = board.getContext("2d");
resetCanvas();
tick();

async function tick() {
  setTimeout(function onTick() {

    tick()
  }, 100);
}

function resetCanvas() {
  board.width = boardWidth;
  board.height = boardHeight;
  boardContext.fillStyle = board_background;
  boardContext.strokestyle = board_border;
  boardContext.fillRect(0, 0, board.width, board.height);
  boardContext.strokeRect(0, 0, board.width, board.height);
}
