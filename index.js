import { Colony } from "./colony.js";
import { FoodFactory } from "./food.js";

const fps = 24;
localStorage.setItem("boardWidth", "800");
localStorage.setItem("boardHeight", "800");
let boardWidth = +localStorage.boardWidth;
let boardHeight = +localStorage.boardHeight;
const boardBorder = "black";
const boardBackground = "white";

const board = document.getElementById("board");
const boardContext = board.getContext("2d");

let colony;
let foodFactory;
setup();

function setup() {
    colony = new Colony();
    foodFactory = new FoodFactory();

    board.width = boardWidth;
    board.height = boardHeight;

    resetCanvas();
    colony.generateAnts();
    foodFactory.generateFood();
    tick();
}

function resetCanvas() {
    boardContext.fillStyle = boardBackground;
    boardContext.strokeStyle = boardBorder;
    boardContext.fillRect(0, 0, board.width, board.height);
    boardContext.strokeRect(0, 0, board.width, board.height);
}

function tick() {
    setTimeout(function onTick() {
        resetCanvas();
        colony.updatePositions();
        colony.paint(boardContext);
        foodFactory.paintFoods(boardContext);


        tick();
    }, 1000 / fps);
}