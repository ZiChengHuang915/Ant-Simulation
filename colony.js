import { Ant } from "./ant.js";

const numAnts = 1;
let boardWidth = +localStorage.boardWidth;
let boardHeight = +localStorage.boardHeight;

export class Colony {
    constructor() {
        let ants = [];
        
    }

    generateAnts() {
        this.ants = [];
        for (let i = 0; i < numAnts; i++) {
            this.ants.push(new Ant(Math.random() * boardWidth, Math.random() * boardHeight));
        }
    }
    
    paint(boardContext) {
        for (let ant of this.ants) {
            ant.paintAnt(boardContext);
            ant.paintTrail(boardContext);
        }
    }
    
    updatePositions() {
        for (let ant of this.ants) {
            ant.updateMovement();
        }
    }
}