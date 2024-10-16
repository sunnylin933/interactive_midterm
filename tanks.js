let hitmap; // Changed variable name from levelHitMap to hitmap
let currentImage;
let tank;

function preload() {
    hitmap = loadImage('images/hitmap.png'); // Load hitmap image
}

function setup() {
    createCanvas(500, 500);
    currentImage = hitmap; // Set currentImage to hitmap
    tank = new Tank(20, 20); // Create a new Tank instance
}

function draw() {
    // Resize the hitmap to fit the canvas size
    image(currentImage, 0, 0, width, height); 
    tank.move(); // Call tank's move method
    tank.display(); // Call tank's display method
}

// Tank class with movement logic
class Tank {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 25;
        this.speed = 2;
        this.color = color(0, 255, 0);
    }

    display() {
        fill(this.color);
        rect(this.x, this.y, this.size, this.size);
    }

    computeSensors() {
        this.middleX = this.x + this.size / 2;
        this.middleY = this.y + this.size / 2;
        this.left = this.x - 2;
        this.right = this.x + this.size + 2;
        this.up = this.y - 2;
        this.down = this.y + this.size + 2;
    }

    move() {
        this.computeSensors();
        this.color = color(0, 255, 0);

        // Movement logic using W, A, S, D keys
        if (keyIsDown(68)) { // D key
            let p = red(hitmap.get(this.right * (hitmap.width / width), this.middleY * (hitmap.height / height))); // Scale for hitmap size
            if (p == 255) {
                this.x += this.speed;
            } else {
                this.color = color(255, 0, 0);
            }
        }

        if (keyIsDown(65)) { // A key
            let p = red(hitmap.get(this.left * (hitmap.width / width), this.middleY * (hitmap.height / height))); // Scale for hitmap size
            if (p == 255) {
                this.x -= this.speed;
            } else {
                this.color = color(255, 0, 0);
            }
        }

        if (keyIsDown(87)) { // W key
            let p = red(hitmap.get(this.middleX * (hitmap.width / width), this.up * (hitmap.height / height))); // Scale for hitmap size
            if (p == 255) {
                this.y -= this.speed;
            } else {
                this.color = color(255, 0, 0);
            }
        }

        if (keyIsDown(83)) { // S key
            let p = red(hitmap.get(this.middleX * (hitmap.width / width), this.down * (hitmap.height / height))); // Scale for hitmap size
            if (p == 255) {
                this.y += this.speed;
            } else {
                this.color = color(255, 0, 0);
            }
        }
    }
}
