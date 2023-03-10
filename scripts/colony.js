import { Ant } from "./ant.js";

const numAnts = 10;
localStorage.setItem("colonyRadius", "30");
const colonyRadius = +localStorage.colonyRadius;
const colonyColor = "brown";
let boardWidth = +localStorage.boardWidth;
let boardHeight = +localStorage.boardHeight;

export class Colony {
    constructor(x = boardWidth / 2, y = boardHeight / 2) {
        this.x = x;
        this.y = y;
        let ants = [];
    }

    generateAnts() {
        this.ants = [];
        for (let i = 0; i < numAnts; i++) {
            this.ants.push(new Ant(this.x, this.y));
        }
    }

    paint(boardContext) {
        boardContext.fillStyle = colonyColor;
        boardContext.beginPath();
        boardContext.ellipse(this.x, this.y, colonyRadius, colonyRadius, 0, 0, 360);
        boardContext.fill();
    }
    
    paintAnts(boardContext) {
        for (let ant of this.ants) {
            ant.paintAnt(boardContext);

            if (!ant.hasFood) {
                ant.paintTrail(boardContext);
            }
        }
    }
    
    updatePositions(foodFactory, boardContext, colony, food) {
        for (let ant of this.ants) {
            ant.updateMovement(foodFactory, boardContext, colony, food);
        }
    }
}