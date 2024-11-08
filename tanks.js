let artHitMap, artBackground, tankImg1, tankImg2, laserSound, explosion;
let tank1, tank2;
let alive = true;
let pause = false;
let winner = "";
let fBase;

let ready1 = false;
let ready2 = false;
let countDown = 100;

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
    strokeCap(SQUARE);

    // Resize images to match canvas size
    artHitMap.resize(width, height);
    artBackground.resize(width, height);
    tankImg1.resize(40, 40);
    tankImg2.resize(40, 40);

    tank1 = new Tank(35, 250, 4.7, 87, 65, 68, 83, 16, tankImg1, color(176, 229, 255));
    tank2 = new Tank(465, 250, 4.7, 73, 74, 76, 75, 13, tankImg2, color(255, 241, 176));

    noStroke();
    laserSound.setVolume(0.35);
    explosion.setVolume(0.15);
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

function togglePause() {
    pause = !pause;
}

function resetGame() {
    console.log('Resetting Game');
    tank1.position.set(35, 250);
    tank2.position.set(465, 250);
    tank1.angle = -PI/2
    tank2.angle = -PI/2
    alive = true;
    pause = false;
    winner = ""; // Reset winner message
    ready1 = false;
    ready2 = false;
    countDown = 100;
}

function eliminated1() {
    togglePause();
    window.parent.endGame(2);
    winner = "Player 1 Wins!";
}

function eliminated2() {
    togglePause();
    window.parent.endGame(1);
    winner = "Player 2 Wins!";
}

function gamePlay() {
    if (!pause) {

        textAlign(CENTER)
        strokeWeight(6)
        stroke(0)

        if (ready1 & ready2){
            if (countDown <= 0 ){
                tank1.update();
                tank2.update();
            }
            else{
                fill(255);
                textSize(45)
                text("GET READY", width/2, height/2)
            }
            if (countDown <= 0 & countDown >= -100){
                fill(255);
                textSize(45)
                text("GO!", width/2, height/2)
            }
            countDown-=1;
        }

        if (!ready1){
            fill(176, 229, 255)
            textSize(30)
            text("PLAYER 1 READY UP", width/2, height*.19)
        }
        if (ready1 & countDown >= 0){
            fill(22, 128, 0);
            textSize(30)
            text("READY", width/2, height*.19)
        }
        if(!ready2 & countDown >= 0){
            fill(255, 241, 176)
            textSize(30)
            text("PLAYER 2 READY UP", width/2, height*.72)
        }
        if (ready2 & countDown >= 0){
            fill(22, 128, 0);
            textSize(30)
            text("READY", width/2, height*.72)
        }

        tank1.display();
        tank2.display();

        // Check for missile collisions
        if(alive){
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
}

function keyPressed(){
    if (!ready1){
        if (key == 'w' || key == 'a' || key =='s' || key =='d'){
            ready1 = true;
        }
    }
    if(!ready2){
        if (key == 'i' || key =='j' || key =='k' || key =='l'){
            ready2 = true;
        }
    }
    if (key == 'p'){
        resetGame();
    }
    
}

function checkMissileTankCollision(missiles, tank) {
    for (let missile of missiles) {
        let distance = dist(missile.position.x, missile.position.y, tank.position.x, tank.position.y);
        let collisionDistance = (missile.size + 20) / 2;
        if (distance < collisionDistance) {
            explosion.play()
            missiles.splice(missiles.indexOf(this),1);
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
        strokeWeight(2)
        
        ellipse(this.position.x, this.position.y, this.size);
        pop();
    }

    shouldRemove() {
        return this.bounces >= 4;
    }
}
