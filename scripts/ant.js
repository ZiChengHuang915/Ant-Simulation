import { pheromoneTable } from "./index.js";
import { degreesToRad, distSq } from "./util.js";

const antColor = "black";
const homeTrailColor = "blue";
const antRadius = 10;
const trailRadius = 1;
const detectionRadius = 10;
const trailEvaporationRate = 0.95;
const topSpeed = 2;
const maxRotationAngle = 20;
const rotationChangeChance = 0.3;
const exploreChance = 0.1;
const findHomeChance = 0.1;
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

    calculateRotationOffset(boardContext) {
        let magnitude = Math.sqrt(this.dx ** 2 + this.dy ** 2);
        let normalizedDx = this.dx / magnitude;
        let normalizedDy = this.dy / magnitude;

        let straightX = this.x + normalizedDx * (detectionRadius * 2);
        let straightY = this.y + normalizedDy * (detectionRadius * 2);
        let rightX = this.x + (normalizedDx * Math.cos(degreesToRad(45)) - normalizedDy * Math.sin(degreesToRad(45))) * (detectionRadius * 2);
        let rightY = this.y + (normalizedDx * Math.sin(degreesToRad(45)) + normalizedDy * Math.cos(degreesToRad(45))) * (detectionRadius * 2);
        let leftX = this.x + (normalizedDx * Math.cos(degreesToRad(-45)) - normalizedDy * Math.sin(degreesToRad(-45))) * (detectionRadius * 2);
        let leftY = this.y + (normalizedDx * Math.sin(degreesToRad(-45)) + normalizedDy * Math.cos(degreesToRad(-45))) * (detectionRadius * 2);

        // debug
        // boardContext.strokeStyle = antColor;
        // boardContext.beginPath();
        // boardContext.ellipse(straightX, straightY, detectionRadius, detectionRadius, 0, 0, 360);
        // boardContext.ellipse(leftX, leftY, detectionRadius, detectionRadius, 0, 0, 360);
        // boardContext.ellipse(rightX, rightY, detectionRadius, detectionRadius, 0, 0, 360);
        // boardContext.stroke();
        // boardContext.strokeRect(this.x - 3 * detectionRadius, this.y - 3 * detectionRadius, 6 * detectionRadius, 6 * detectionRadius);

        let pheromoneSumStraight = 0;
        let pheromoneSumRight = 0;
        let pheromoneSumLeft = 0;
        for (let i = Math.round(this.x - detectionRadius * 3); i < this.x + detectionRadius * 3; i++) {
            for (let j = Math.round(this.y - detectionRadius * 3); j < this.y + detectionRadius * 3; j++) {
                if (i >= boardWidth || i < 0 || j >= boardHeight || j < 0) {
                    continue;
                }

                if (distSq(i, j, straightX, straightY) < detectionRadius ** 2) {
                    pheromoneSumStraight += pheromoneTable.pheromoneLevel[i][j];
                }
                if (distSq(i, j, rightX, rightY) < detectionRadius ** 2) {
                    pheromoneSumRight += pheromoneTable.pheromoneLevel[i][j];
                }
                if (distSq(i, j, leftX, leftY) < detectionRadius ** 2) {
                    pheromoneSumLeft += pheromoneTable.pheromoneLevel[i][j];
                }
            }
        }

        if (Math.max(pheromoneSumStraight, pheromoneSumRight, pheromoneSumLeft) == pheromoneSumStraight) {
            return 0;
        } else if (Math.max(pheromoneSumStraight, pheromoneSumRight, pheromoneSumLeft) == pheromoneSumLeft) {
            return -maxRotationAngle;
        } else {
            return maxRotationAngle;
        }
    }

    updateMovement(foodFactory, boardContext, colony, food) {
        if (this.foundFood(foodFactory)) {
            this.hasFood = true;

            this.dx *= -1;
            this.dy *= -1;
            this.updatePosition();
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

            // this will break for more than 1 food fix later
            if (distSq(this.x, this.y, food.x, food.y) < (+localStorage.foodRadius + detectionRadius * 3) ** 2) {
                let toFoodX = food.x - this.x;
                let toFoodY = food.y - this.y;

                let magnitude = Math.sqrt(toFoodX ** 2 + toFoodY ** 2);
                this.dx = toFoodX / magnitude * topSpeed;
                this.dy = toFoodY / magnitude * topSpeed;
            }

            if (Math.random() < exploreChance) {
                this.changeRotationAngle();
                this.updatePosition();
            } else {
                let rotationOffset = this.calculateRotationOffset(boardContext);
                this.changeRotationAngle(false, rotationOffset);
                this.updatePosition();
            }
        } else {
            // should return home with food

            let nearestX = Math.round(this.x);
            let nearestY = Math.round(this.y);
            if (nearestX < 0) {
                nearestX = 0;
            } else if (nearestX >= boardWidth) {
                nearestX = boardWidth - 1;
            }
            if (nearestY < 0) {
                nearestY = 0;
            } else if (nearestY >= boardHeight) {
                nearestY = boardHeight - 1;
            }

            pheromoneTable.pheromoneLevel[nearestX][nearestY] = 1;

            if (this.homeTrail.length != 0) {
                this.homeTrail = [];
            }

            if (distSq(this.x, this.y, colony.x, colony.y) < (+localStorage.colonyRadius) ** 2) {
                this.hasFood = false;
                localStorage.setItem("foodForaged", `${+localStorage.foodForaged + 1}`);

                this.dx *= -1;
                this.dy *= -1;
            } else {
                if (Math.random() < findHomeChance) {
                    let toColonyX = colony.x - this.x;
                    let toColonyY = colony.y - this.y;

                    let magnitude = Math.sqrt(toColonyX ** 2 + toColonyY ** 2);
                    this.dx = toColonyX / magnitude * topSpeed;
                    this.dy = toColonyY / magnitude * topSpeed;
                }

                this.changeRotationAngle();
                this.updatePosition();
            }
        }
    }

    updatePosition() {
        this.x += this.dx;
        this.y += this.dy;
    }

    changeRotationAngle(forceChange = false, offset = 0) {
        if (Math.random() < rotationChangeChance || forceChange) {
            this.rotationAngle = offset + Math.random() * degreesToRad(maxRotationAngle * 2) - degreesToRad(maxRotationAngle * 2) / 2;
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
        for (let i = this.homeTrail.length - 1; i >= 0; i--) {
            boardContext.globalAlpha *= trailEvaporationRate;
            if (boardContext.globalAlpha < 0.1) {
                break;
            }
            boardContext.beginPath();
            boardContext.ellipse(this.homeTrail[i].x, this.homeTrail[i].y, trailRadius, trailRadius, 0, 0, 360);
            boardContext.fill();
        }
        boardContext.globalAlpha = 1;
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