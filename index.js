const boardWidth = 400;
const boardHeight = 400;
const boardBorder = "black";
const boardBackground = "white";
const antColor = "green";
const antRadius = 1;
const antNumber = 1;

const board = document.getElementById("board");
const boardContext = board.getContext("2d");
let ants = [];

resetCanvas();
tick();

function resetCanvas() {
    board.width = boardWidth;
    board.height = boardHeight;
    boardContext.fillStyle = boardBackground;
    boardContext.strokestyle = boardBorder;
    boardContext.fillRect(0, 0, board.width, board.height);
    boardContext.strokeRect(0, 0, board.width, board.height);
}

class Ant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        let dx = 0;
        let dy = 0;
    }

    paint() {
        boardContext.beginPath();
        boardContext.ellipse(this.x, this.y, antRadius, antRadius, 0, 0, 360);
        boardContext.strokestyle = antColor;
        boardContext.stroke();
    }
}


function generateAnts() {
    for (let i = 0; i < antNumber; i++) {
        ants.push(new Ant(Math.random() * boardWidth, Math.random() * boardHeight));
    }

    for (let ant of ants) {
        ant.paint();
    }
}

function tick() {
    setTimeout(function onTick() {
        generateAnts()
        tick()
    }, 100);
}