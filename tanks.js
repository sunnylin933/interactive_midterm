let artHitMap, artBackground, tankImg1, tankImg2, laserSound, explosion;
let tank1, tank2;
let alive = true;
let pause = false;
let winner = "";
let fBase;

function preload() {
    artHitMap = loadImage('images/hitmap.png');
    artBackground = loadImage('images/tankGraphic.png');
    tankImg1 = loadImage('images/tank_char_1.png');
    tankImg2 = loadImage('images/tank_char_2.png');
    fBase = loadFont('fonts/base.ttf');
    
    laserSound = loadSound('images/laser.mp3')
    explosion = loadSound('images/explosion.mp3')
}
function setup() {
    createCanvas(500, 500);
    rectMode(CENTER);
    textFont(fBase);
    imageMode(CENTER);

    // Resize images to match canvas size
    artHitMap.resize(width, height);
    artBackground.resize(width, height);
    tankImg1.resize(40, 40);
    tankImg2.resize(40, 40);

    tank1 = new Tank(465, 250, 4.7, 87, 65, 68, 83, 16, tankImg1, color(255, 0, 0));
    tank2 = new Tank(35, 250, 4.7, 73, 74, 76, 75, 13, tankImg2, color(0, 255, 0));
}

function draw() {
    image(artBackground, width/2, height/2, width, height);

    if (alive) {
        gamePlay();
    } 

    // Display the winner message if there is a winner
    if (winner !== "") {
        displayWinnerMessage(winner);
    }
}

function pauseGame() {
    pause = true;
}

function resetGame() {
    tank1.position.set(465, 250);
    tank2.position.set(35, 250);
    alive = true;
    pause = false;
    winner = ""; // Reset winner message
}

function eliminated1() {
    pauseGame();
    winner = "Player 1 Wins!";
}

function eliminated2() {
    pauseGame();
    winner = "Player 2 Wins!";
}

function gamePlay() {
    if (!pause) {
        tank1.update();
        tank1.display();
        tank2.update();
        tank2.display();

        // Check for missile collisions
        if (checkMissileTankCollision(tank1.missiles, tank2)) {
            alive = false;
            eliminated1();
        }
        if (checkMissileTankCollision(tank2.missiles, tank1)) {
            alive = false;
            eliminated2();
        }
    }
}

function checkMissileTankCollision(missiles, tank) {
    for (let missile of missiles) {
        let distance = dist(missile.position.x, missile.position.y, tank.position.x, tank.position.y);
        let collisionDistance = (missile.size + 20) / 2;
        if (distance < collisionDistance) {
            explosion.play()
            return true;
        }
    }
    return false;
}

// Display the winner message at the top of the screen
function displayWinnerMessage(message) {
    background(50, 50, 50, 150);

    // Display the winner message
    textSize(50);
    textAlign(CENTER);
    fill(255, 215, 0);
    noStroke();       
    text(message, width / 2, height / 2);
}

class Tank {
    constructor(x, y, angle, upKey, leftKey, rightKey, downKey, fireKey, tankImg, color) {
        this.position = createVector(x, y);
        this.angle = angle;
        this.sensorDistance = 20;
        this.keys = { up: upKey, left: leftKey, right: rightKey, down: downKey, fire: fireKey };
        this.missiles = [];

        this.coolDown = 20;
        this.counter = 0;

        this.tankImg = tankImg
        this.color = color
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
                explosion.play()
            }
        }

        this.counter += 1;
    }

    moveForward() {
        let sensorPosition = p5.Vector.fromAngle(this.angle).mult(this.sensorDistance).add(this.position);
        
        let hitmapX = int(sensorPosition.x);
        let hitmapY = int(sensorPosition.y);
        
        if (hitmapX >= 0 && hitmapX < artHitMap.width && hitmapY >= 0 && hitmapY < artHitMap.height) {
            let sensorColor = artHitMap.get(hitmapX, hitmapY); 

            if (red(sensorColor) > 200 && green(sensorColor) > 200 && blue(sensorColor) > 200) {
                let direction = p5.Vector.fromAngle(this.angle).mult(2);
                this.position.add(direction);
            }        
        }
    }

    moveBackward() {
        let reverseSensorPosition = p5.Vector.fromAngle(this.angle + PI).mult(this.sensorDistance).add(this.position);
        
        let hitmapX = int(reverseSensorPosition.x);
        let hitmapY = int(reverseSensorPosition.y);
        
        if (hitmapX >= 0 && hitmapX < artHitMap.width && hitmapY >= 0 && hitmapY < artHitMap.height) {
            let sensorColor = artHitMap.get(hitmapX, hitmapY);

            if (red(sensorColor) > 200 && green(sensorColor) > 200 && blue(sensorColor) > 200) {
                let direction = p5.Vector.fromAngle(this.angle + PI).mult(2);
                this.position.add(direction);
            }
        }
    }

    fireMissile() {
        if (this.counter > this.coolDown) {
            this.missiles.push(new Missile(this.position.copy(), this.angle, this.color));
            this.counter = 0;
            laserSound.play()
        }
    }

    display() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        fill(255);
        image(this.tankImg, 0, 0);
        translate(this.sensorDistance, 0);
        pop();
    }
}

class Missile {
    constructor(position, angle, color) {
        this.position = position;
        this.velocity = p5.Vector.fromAngle(angle).mult(5);
        this.size = 10;
        this.bounces = 0;
        this.color = color;
    }

    update() {
        let nextPositionX = this.position.x + this.velocity.x;
        let nextPositionY = this.position.y + this.velocity.y;
        
        let hasBounced = false;

        if (!hasBounced && this.isColliding(nextPositionX, this.position.y)) {
            this.velocity.x *= -1;
            hasBounced = true;
            this.bounces++;
        }

        if (!hasBounced && this.isColliding(this.position.x, nextPositionY)) {
            this.velocity.y *= -1;
            hasBounced = true;
            this.bounces++;
        }

        this.position.add(this.velocity);
    }

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
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.size);
        pop();
    }

    shouldRemove() {
        return this.bounces >= 4;
    }
}
