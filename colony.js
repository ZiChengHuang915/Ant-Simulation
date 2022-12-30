import { Ant } from "./ant.js";

const numAnts = 20;
const colonyRadius = 30;
const colonyColor = "brown";
let boardWidth = +localStorage.boardWidth;
let boardHeight = +localStorage.boardHeight;

export class Colony {
    constructor(x = Math.random() * boardWidth, y = Math.random() * boardHeight) {
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
        boardContext.strokeStyle = colonyColor;
        boardContext.beginPath();
        boardContext.ellipse(this.x, this.y, colonyRadius, colonyRadius, 0, 0, 360);
        boardContext.stroke();
    }
    
    paintAnts(boardContext) {
        for (let ant of this.ants) {
            ant.paintAnt(boardContext);
            ant.paintTrail(boardContext);
        }
    }
    
    updatePositions(foodFactory) {
        for (let ant of this.ants) {
            ant.updateMovement(foodFactory);
        }
    }
}