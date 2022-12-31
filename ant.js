import { FoodFactory } from "./food.js";
import { degreesToRad } from "./util.js";

const antColor = "black";
const homeTrailColor = "blue";
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

        this.homeTrail = [];
        this.hasFood = false;
    }

    updateMovement(foodFactory) {
        if (this.foundFood(foodFactory)) {
            this.hasFood = true;
        }

        if (!this.hasFood) {
            // should explore

            let currentCoord = {
                x: this.x,
                y: this.y,
            };
            this.homeTrail.push(currentCoord);

            // bounce off walls
            if (this.x > boardWidth || this.x < 0) {
                this.dx *= -1;
            } else if (this.y > boardHeight || this.y < 0) {
                this.dy *= -1;
            }

            this.changeRotationAngle();
            this.updatePosition();
        } else {
            // should return home with food

            if (this.homeTrail.length == 0) {
                this.hasFood = false;
                localStorage.setItem("foodForaged", `${+localStorage.foodForaged + 1}`);

                if (Math.random() < 0.5) {
                    this.dx *= -1;
                }
                if (Math.random() < 0.5) {
                    this.dy *= -1;
                }
            } else {
                let currentCoord = this.homeTrail.pop();
                this.x = currentCoord.x;
                this.y = currentCoord.y;
            }
        }
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
        boardContext.fillStyle = antColor;
        boardContext.beginPath();
        boardContext.ellipse(this.x, this.y, antRadius, antRadius, 0, 0, 360);
        boardContext.fill();
    }

    paintTrail(boardContext) {
        boardContext.fillStyle = homeTrailColor;
        for (let point of this.homeTrail) {
            boardContext.beginPath();
            boardContext.ellipse(point.x, point.y, trailRadius, trailRadius, 0, 0, 360);
            boardContext.fill();
        }
    }

    foundFood(foodFactory) {
        let foodRadius = +localStorage.foodRadius;
        for (let food of foodFactory.foods) {
            if ((this.x - food.x) ** 2 + (this.y - food.y) ** 2 <= foodRadius ** 2) {
                return true;
            }
        }

        return false;
    }
}