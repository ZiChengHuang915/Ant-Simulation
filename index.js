import { Colony } from "./colony.js";
import { FoodFactory } from "./food.js";

const fps = 60;
localStorage.setItem("boardWidth", "800");
localStorage.setItem("boardHeight", "800");
localStorage.setItem("foodForaged", "0");
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
        colony.paint(boardContext);
        colony.updatePositions(foodFactory);
        colony.paintAnts(boardContext);
        foodFactory.paintFoods(boardContext);
        updateScore();

        tick();
    }, 1000 / fps);
}

export function updateScore() {
    document.getElementById("score").innerHTML = localStorage.foodForaged;
}