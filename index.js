import { Ant } from "./ant.js";

const fps = 24;
const boardWidth = 800;
const boardHeight = 800;
const boardBorder = "black";
const boardBackground = "white";
const antNumber = 1;

const board = document.getElementById("board");
const boardContext = board.getContext("2d");
let ants = [];

board.width = boardWidth;
board.height = boardHeight;
setup();
tick();

function setup() {
    resetCanvas();
    generateAnts();
}

function resetCanvas() {
    boardContext.fillStyle = boardBackground;
    boardContext.strokestyle = boardBorder;
    boardContext.fillRect(0, 0, board.width, board.height);
    boardContext.strokeRect(0, 0, board.width, board.height);
}

function generateAnts() {
    for (let i = 0; i < antNumber; i++) {
        ants.push(new Ant(Math.random() * boardWidth, Math.random() * boardHeight));
    }
}

function paintAnts(boardContext) {
    for (let ant of ants) {
        ant.paint(boardContext);
    }
}

function updatePositions() {
    for (let ant of ants) {
        if (ant.x > boardWidth || ant.x < 0) {
            ant.dx *= -1;
        } else if (ant.y >boardHeight || ant.y < 0) {
            ant.dy *= -1;
        }

        ant.updateRotationAngle();
        ant.updatePosition();
    }
}

function tick() {
    setTimeout(function onTick() {
        resetCanvas();
        updatePositions();
        paintAnts(boardContext);


        tick();
    }, 1000 / fps);
}