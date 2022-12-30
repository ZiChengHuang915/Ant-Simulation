import { degreesToRad } from "./util.js";

const antColor = "green";
const antRadius = 4;
const topSpeed = 10;
const maxRotationAngle = 50;
const rotationChangeChance = 0.03;

export class Ant {
    constructor(x, y, dx = topSpeed, dy = topSpeed, rotationAngle = 0) {
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
    }

    updatePosition() {
        this.x += this.dx;
        this.y += this.dy;
    }

    updateRotationAngle() {
        if (Math.random() < rotationChangeChance) {
            this.rotationAngle = Math.random() * degreesToRad(maxRotationAngle);
            this.rotateVelocity();
            console.log(this.rotationAngle);
        }
    }

    rotateVelocity() {
        this.dx = this.dx * Math.cos(this.rotationAngle) - this.dy * Math.sin(this.rotationAngle);
        this.dy = this.dx * Math.sin(this.rotationAngle) + this.dy * Math.cos(this.rotationAngle);
    }

    paint(boardContext) {
        boardContext.beginPath();
        boardContext.ellipse(this.x, this.y, antRadius, antRadius, 0, 0, 360);
        boardContext.strokestyle = antColor;
        boardContext.stroke();
    }
}