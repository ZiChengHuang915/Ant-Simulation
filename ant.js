import { degreesToRad } from "./util.js";

const antColor = "black";
const pheromoneTrailColor = "blue";
const antRadius = 3;
const trailRadius = 1;
const topSpeed = 2;
const maxRotationAngle = 20;
const rotationChangeChance = 0.3;
let boardWidth = +localStorage.boardWidth;
let boardHeight = +localStorage.boardHeight;

export class Ant {
    constructor(x, y, dx = topSpeed, dy = topSpeed, rotationAngle = Math.random() * degreesToRad(maxRotationAngle * 2) - degreesToRad(maxRotationAngle * 2) / 2) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.rotationAngle = rotationAngle;

        if (Math.random() < 0.5) {
            this.dx *= -1;
        }
        if (Math.random() < 0.5) {
            this.dy *= -1;
        }

        this.pheromoneTrail = [];
    }

    updateMovement() {
        let currentCoord = {
            x: this.x,
            y: this.y,
        };
        this.pheromoneTrail.push(currentCoord);

        // bounce off walls
        if (this.x > boardWidth || this.x < 0) {
            this.dx *= -1;
        } else if (this.y > boardHeight || this.y < 0) {
            this.dy *= -1;
        }

        this.changeRotationAngle();
        this.updatePosition();
    }

    updatePosition() {
        this.x += this.dx;
        this.y += this.dy;
    }

    changeRotationAngle(forceChange = false) {
        if (Math.random() < rotationChangeChance || forceChange) {
            this.rotationAngle = Math.random() * degreesToRad(maxRotationAngle * 2) - degreesToRad(maxRotationAngle * 2) / 2;
            this.rotateVelocity();
        }
    }

    rotateVelocity() {
        let x1 = this.dx;
        let y1 = this.dy;
        this.dx = x1 * Math.cos(this.rotationAngle) - y1 * Math.sin(this.rotationAngle);
        this.dy = x1 * Math.sin(this.rotationAngle) + y1 * Math.cos(this.rotationAngle);
    }

    paintAnt(boardContext) {
        boardContext.strokeStyle = antColor;
        boardContext.beginPath();
        boardContext.ellipse(this.x, this.y, antRadius, antRadius, 0, 0, 360);
        boardContext.stroke();
    }

    paintTrail(boardContext) {
        boardContext.strokeStyle = pheromoneTrailColor;
        for (let point of this.pheromoneTrail) {
            boardContext.beginPath();
            boardContext.ellipse(point.x, point.y, trailRadius, trailRadius, 0, 0, 360);
            boardContext.stroke();
        }
        
    }
}