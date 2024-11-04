//Game Variables
let canvasSize = 500;
let isGameOver = false;

//Player Variables
let playerX = canvasSize / 2;
let playerY = canvasSize / 2;

function preload() {
    playerChar = loadImage('images/player_char_lobby.png');
    fBase = loadFont('fonts/base.ttf');
}


function setup() {
    let canvas = createCanvas(canvasSize, canvasSize);
    background(0);
    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER);
    angleMode(DEGREES);
    textFont(fBase);
}

function draw() {
    background(0);

    if (!isGameOver) {
        textSize(18);
        fill(255);
        text('MCP Cone', canvasSize / 2, 25)
        push();
        translate(25, canvasSize / 2);
        rotate(-90);
        text('Battle Tanks', 0, 0)
        pop();
        push();
        translate(canvasSize - 25, canvasSize / 2);
        rotate(90);
        text('Light Cycles', 0, 0)
        pop();

        if (keyIsDown(87)) {
            playerY -= 2.5;
        }
        if (keyIsDown(83)) {
            playerY += 2.5;
        }
        if (keyIsDown(65)) {
            playerX -= 2.5;
        }
        if (keyIsDown(68)) {
            playerX += 2.5;
        }

        image(playerChar, playerX, playerY, 48, 96);

        if (playerY <= 48) {
            //Cones
            window.parent.enableMinigame(2);
        }

        if (playerY >= canvasSize - 48) {
            playerY = canvasSize - 48;
        }

        if (playerX <= 24) {
            //Tanks
            window.parent.enableMinigame(1);
        }

        if (playerX >= canvasSize - 24) {
            //Lightcycle
            window.parent.enableMinigame(0);
        }
    }
    else
    {
        textSize(42);
        if(window.parent.p1Lives <= 0){
            fill(255, 241, 176);
            text('Player 2 Victory!', canvasSize/2, canvasSize/2);
        }
        else if(window.parent.p2Lives <= 0){
            fill(176, 229, 255);
            text('Player 1 Victory!', canvasSize/2, canvasSize/2);
        }
    }

}

function resetPosition() {
    playerX = canvasSize / 2;
    playerY = canvasSize / 2;
}

function endGame(){
    isGameOver = true;
}