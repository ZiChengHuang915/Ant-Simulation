import { Colony } from "./colony.js";
import { FoodFactory } from "./food.js";

const fps = 60;
localStorage.setItem("boardWidth", "400");
localStorage.setItem("boardHeight", "400");
localStorage.setItem("foodForaged", "0");
let boardWidth = +localStorage.boardWidth;
let boardHeight = +localStorage.boardHeight;
const pheromoneEvaporationRate = 0.99;
const pheromoneColor = "red";
const pheromoneRadius = 1;
const boardBorder = "black";
const boardBackground = "white";

const board = document.getElementById("board");
const boardContext = board.getContext("2d");
export const pheromoneTable = {
    pheromoneLevel: null,
}

let colony;
let foodFactory;
setup();

function setup() {
    colony = new Colony();
    foodFactory = new FoodFactory();

    board.width = boardWidth;
    board.height = boardHeight;

    resetPheromoneTable();
    resetCanvas();
    colony.generateAnts();
    foodFactory.generateFood(colony.x, colony.y);
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
        colony.updatePositions(foodFactory, boardContext, colony, foodFactory.foods[0]);
        colony.paintAnts(boardContext);
        foodFactory.paintFoods(boardContext);
        updateScore();
        evaporatePheromoneTable();
        paintPheromoneTable();

        tick();
    }, 1000 / fps);
}

export function updateScore() {
    boardContext.font = "20px Arial";
    boardContext.fillStyle = "black";
    boardContext.textAlign = "center";
    boardContext.fillText(localStorage.foodForaged, colony.x, colony.y + 8);
}

function resetPheromoneTable() {
    pheromoneTable.pheromoneLevel = new Array(boardWidth).fill(0).map(() => new Array(boardHeight).fill(0));
}

function evaporatePheromoneTable() {
    for (let i = 0; i < boardWidth; i++) {
        if (Math.max.apply(null, pheromoneTable.pheromoneLevel[i]) == 0) {
            continue;
        }

        var evaporate = function(x) {
            if (x < 0.1) {
                return 0;
            }
            return x * pheromoneEvaporationRate;
        }

        pheromoneTable.pheromoneLevel[i] = pheromoneTable.pheromoneLevel[i].map(evaporate);
    }
}

function paintPheromoneTable() {
    boardContext.fillStyle = pheromoneColor;
    for (let i = 0; i < boardWidth; i++) {
        if (Math.max.apply(null, pheromoneTable.pheromoneLevel[i]) == 0) {
            continue;
        }

        for (let j = 0; j < boardHeight; j++) {
            boardContext.globalAlpha = pheromoneTable.pheromoneLevel[i][j];
            if (boardContext.globalAlpha < 0.1) {
                continue;
            }
            boardContext.beginPath();
            boardContext.ellipse(i, j, pheromoneRadius, pheromoneRadius, 0, 0, 360);
            boardContext.fill();
        }
    }
    boardContext.globalAlpha = 1;
}