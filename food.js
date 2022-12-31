let boardWidth = +localStorage.boardWidth;
let boardHeight = +localStorage.boardHeight;

const foodColor = "green";
localStorage.setItem("foodRadius", "200");
let foodRadius = +localStorage.foodRadius;

export class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    paint(boardContext) {
        boardContext.fillStyle = foodColor;
        boardContext.beginPath();
        boardContext.ellipse(this.x, this.y, foodRadius, foodRadius, 0, 0, 360);
        boardContext.fill();
    }
}

const numFood = 1;
export class FoodFactory {
    constructor() {
        this.foods = [];
    }

    generateFood(colonyX, colonyY) {
        this.foods = [];
        for (let i = 0; i < numFood; i++) {
            let potentialX = Math.random() * boardWidth;
            let potentialY = Math.random() * boardHeight;
            
            while ((potentialX - colonyX) ** 2 + (potentialY - colonyY) ** 2 <= (foodRadius + +localStorage.colonyRadius) ** 2) {
                potentialX = Math.random() * boardWidth;
                potentialY = Math.random() * boardHeight;
            }

            this.foods.push(new Food(potentialX, potentialY));
        }
    }

    paintFoods(boardContext) {
        for (let food of this.foods) {
            food.paint(boardContext);
        }
    }
}