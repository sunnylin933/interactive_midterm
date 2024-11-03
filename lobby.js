//Game Variables
let canvasSize = 500;

//Player Variables
let playerX = canvasSize/2;
let playerY = canvasSize/2;

function setup(){
    let canvas = createCanvas(canvasSize, canvasSize);
    background(0);
    rectMode(CENTER);
}

function draw(){
    background(0);
    rect(playerX, playerY, 15, 30);

    if(keyIsDown(UP_ARROW) || keyIsDown()){
        playerY -= 2.5;
    }
    if(keyIsDown(115)){
        playerY += 2.5;
    }
    if(keyIsDown(97)){
        playerX -= 2.5;
    }
    if(keyIsDown(100)){
        playerX += 2.5;
    }
}
