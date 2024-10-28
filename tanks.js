let artHitMap;
let tank1, tank2;
let alive = true;

function preload() {
    artHitMap = loadImage('images/hitmap.png');
}

function setup() {
    createCanvas(500, 500);
    rectMode(CENTER);

    // Resize artHitMap to match the canvas size
    artHitMap.resize(width, height);

    // Create two tanks with specific key mappings
    tank1 = new Tank(250, 250, 87, 65, 68, 83, 16); // W, A, D, S, SHIFT for tank1 fire
    tank2 = new Tank(100, 100, 73, 74, 76, 75, 13); // I, J, L, K, ENTER for tank2 fire
}

function draw() {
    image(artHitMap, 0, 0, width, height);
    if (alive == true){
        gamePlay();
    }
    else{
        eliminated();
    }
    
}

function gamePlay() {
    // Update and display each tank
    tank1.update();
    tank1.display();
    tank2.update();
    tank2.display();

    // Check if any missiles from tank1 collide with tank2
    if (checkMissileTankCollision(tank1.missiles, tank2)) {
        alive = false;
        console.log("Tank 2 hit!");
    }

    // Check if any missiles from tank2 collide with tank1
    if (checkMissileTankCollision(tank2.missiles, tank1)) {
        alive = false;
        console.log("Tank 1 hit!");
    }
}

// Function to check if any missiles from a specific tank collide with another tank
function checkMissileTankCollision(missiles, tank) {
    for (let missile of missiles) {
        let distance = dist(missile.position.x, missile.position.y, tank.position.x, tank.position.y);
        let collisionDistance = (missile.size + 20) / 2;

        if (distance < collisionDistance) {
            return true;
        }
    }
    return false;
}

function eliminated(){
    background (0);
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Bring players back to overworld", width/2, height/2)
}

class Tank {
    constructor(x, y, upKey, leftKey, rightKey, downKey, fireKey) {
        this.position = createVector(x, y);
        this.angle = 0;
        this.sensorDistance = 20;
        this.keys = { up: upKey, left: leftKey, right: rightKey, down: downKey, fire: fireKey };
        this.missiles = [];

        this.coolDown = 20;
        this.counter = 0;
    }

    update() {
        // Rotate the tank
        if (keyIsDown(this.keys.left)) {
            this.angle -= 0.05;
        }
        if (keyIsDown(this.keys.right)) {
            this.angle += 0.05;
        }

        // Move the tank using specified keys
        if (keyIsDown(this.keys.up)) {
            this.moveForward();
        }
        if (keyIsDown(this.keys.down)) {
            this.moveBackward();
        }

        // Fire a missile if the fire key is pressed
        if (keyIsDown(this.keys.fire)) {
            this.fireMissile();
        }

        // Update missiles
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            let missile = this.missiles[i];
            missile.update();
            missile.display();

            // Remove missile if it has bounced 4 times
            if (missile.shouldRemove()) {
                this.missiles.splice(i, 1);
            }
        }

        this.counter+=1;
    }

    moveForward() {
        let sensorPosition = p5.Vector.fromAngle(this.angle).mult(this.sensorDistance).add(this.position);
        
        // Check collision with resized artHitMap
        let hitmapX = int(sensorPosition.x);
        let hitmapY = int(sensorPosition.y);
        
        if (hitmapX >= 0 && hitmapX < artHitMap.width && hitmapY >= 0 && hitmapY < artHitMap.height) {
            let sensorColor = artHitMap.get(hitmapX, hitmapY); 

            // Check for white color (255, 255, 255) for movement
            if (red(sensorColor) > 200 && green(sensorColor) > 200 && blue(sensorColor) > 200) {
                let direction = p5.Vector.fromAngle(this.angle).mult(2);
                this.position.add(direction);
            }        
        }
    }

    moveBackward() {
        let reverseSensorPosition = p5.Vector.fromAngle(this.angle + PI).mult(this.sensorDistance).add(this.position);
        
        // Check collision with resized artHitMap
        let hitmapX = int(reverseSensorPosition.x);
        let hitmapY = int(reverseSensorPosition.y);
        
        if (hitmapX >= 0 && hitmapX < artHitMap.width && hitmapY >= 0 && hitmapY < artHitMap.height) {
            let sensorColor = artHitMap.get(hitmapX, hitmapY);

            // Check for white color (255, 255, 255) for movement
            if (red(sensorColor) > 200 && green(sensorColor) > 200 && blue(sensorColor) > 200) {
                let direction = p5.Vector.fromAngle(this.angle + PI).mult(2);
                this.position.add(direction);
            }
        }
    }

    fireMissile() {
        // Fire a new missile and add it to the missiles array
        if (this.counter > this.coolDown){
            this.missiles.push(new Missile(this.position.copy(), this.angle));
            this.counter = 0;
        }
        
    }

    display() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        fill(255);
        rect(0, 0, 20, 20); // Tank size
        translate(this.sensorDistance, 0);
        fill(0, 255, 0);
        rect(0, 0, 10, 10); // Sensor representation
        pop();
    }
}

// Missile class definition
class Missile {
    constructor(position, angle) {
        this.position = position;
        this.velocity = p5.Vector.fromAngle(angle).mult(5);
        this.size = 5;
        this.bounces = 0;
    }

    update() {
        let nextPositionX = this.position.x + this.velocity.x;
        let nextPositionY = this.position.y + this.velocity.y;
        
        let hasBounced = false;

        // Check X-axis boundary (horizontal reflection)
        if (!hasBounced && this.isColliding(nextPositionX, this.position.y)) {
            this.velocity.x *= -1;
            hasBounced = true;
            this.bounces++;
        }

        // Check Y-axis boundary (vertical reflection)
        if (!hasBounced && this.isColliding(this.position.x, nextPositionY)) {
            this.velocity.y *= -1;
            hasBounced = true;
            this.bounces++;
        }

        this.position.add(this.velocity);
    }

    // Check if position collides with black (barrier) on the hitmap
    isColliding(x, y) {
        let hitmapX = int(x);
        let hitmapY = int(y);

        if (hitmapX >= 0 && hitmapX < artHitMap.width && hitmapY >= 0 && hitmapY < artHitMap.height) {
            let sensorColor = artHitMap.get(hitmapX, hitmapY);
            return red(sensorColor) < 50 && green(sensorColor) < 50 && blue(sensorColor) < 50;
        }
        return false;
    }

    display() {
        push();
        fill(255, 0, 0);
        ellipse(this.position.x, this.position.y, this.size);
        pop();
    }

    // Check if missile should be removed after 4 bounces
    shouldRemove() {
        return this.bounces >= 4;
    }
}
