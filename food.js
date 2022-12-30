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
        boardContext.strokeStyle = foodColor;
        boardContext.beginPath();
        boardContext.ellipse(this.x, this.y, foodRadius, foodRadius, 0, 0, 360);
        boardContext.stroke();
    }
}

const numFood = 1;
export class FoodFactory {
    constructor() {
        this.foods = [];
    }

    generateFood() {
        this.foods = [];
        for (let i = 0; i < numFood; i++) {
            this.foods.push(new Food(Math.random() * boardWidth, Math.random() * boardHeight));
        }
    }

    paintFoods(boardContext) {
        for (let food of this.foods) {
            food.paint(boardContext);
        }
    }
}