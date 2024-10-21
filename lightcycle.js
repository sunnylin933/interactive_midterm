let canvasSize = 500;

//Player Variables
let playerX = canvasSize/2;
let playerY = canvasSize - 55;
let playerXSpeed = 0;
let playerYSpeed = 0;
let playerMoveSpeed = 1.5;
let playerDirection = 4;
let playerRotation = 90;

//Player Lines
let lineStartX = canvasSize/2;
let lineStartY = canvasSize - 45;
let lineEndX = 0;
let lineEndY = 0;
let lineArray = [];

function preload(){
    iPlayer = loadImage('images/player_char.png');
}

function setup() {
    createCanvas(canvasSize, canvasSize);
    noSmooth();
    angleMode(DEGREES); 
    background(0);
}


function draw(){
    background(0,0,0,60);
    imageMode(CENTER);

    //Movement Detection
    switch(playerDirection){
        case 0:
            //Forward
            playerXSpeed = 0;
            playerYSpeed = -1 * playerMoveSpeed;
            break;
        case 1:
            //Right
            playerXSpeed = 1 * playerMoveSpeed;
            playerYSpeed = 0;
            break;
        case  2:
            //Down
            playerXSpeed = 0;
            playerYSpeed = 1 * playerMoveSpeed;
            break;
        case 3:
            //Left
            playerXSpeed = -1 * playerMoveSpeed;
            playerYSpeed = 0;
            break;
        case 4:
            playerXSpeed = 0;
            playerYSpeed = 0;
    }

    playerX = playerX + playerXSpeed;
    playerY = playerY + playerYSpeed;

    //Line Drawing
    lineEndX = playerX;
    lineEndY = playerY;
    stroke(140, 184, 255);
    strokeWeight(5);
    //draws the most recent line before it's saved
    line(lineStartX, lineStartY, lineEndX, lineEndY);
    
    for(let i = 0; i < lineArray.length; i++){
        lineArray[i].displaySelf();
        lineArray[i].detectCollisions();
    }
    
    //Player Display
    push();
    translate(playerX, playerY);
    rotate(playerRotation);
    image(iPlayer, 0, 0, 48, 24);
    pop();

}

function keyPressed(){
    if(playerYSpeed == 0){ //This prevents 180 turns
        if(key === 'w'){
            saveLine(0);
            playerDirection = 0;
            playerRotation = 90;
        }
        if(key === 's'){
            saveLine(0);
            playerDirection = 2;
            playerRotation = 270;
        }
    }
    if(playerXSpeed == 0){
        if(key === 'd'){
            saveLine(1);
            playerDirection = 1;
            playerRotation = 180;
        }
        if(key === 'a'){
            saveLine(1);
            playerDirection = 3;
            playerRotation = 0;
        }
    }

    if(key === 'r'){
        resetLevel();
    }
}

function saveLine(type){
    console.log('Registering new line.')
    lineArray.push(new lightLine(lineStartX, lineStartY, playerX, playerY, type));
    //moves the goalposts
    lineStartX = playerX;
    lineStartY = playerY;
}

function resetLevel(){
    //Reset Variables
    playerX = canvasSize/2;
    playerY = canvasSize - 55;
    playerXSpeed = 0;
    playerYSpeed = 0;
    playerDirection = 4;
    playerRotation = 90;

    lineStartX = canvasSize/2;
    lineStartY = canvasSize - 45;
    lineArray = [];
}

class lightLine{
    constructor(x,y,a,b,z){
        this.startX = x;
        this.startY = y;
        this.endX = a;
        this.endY = b;
        this.direction = z; //0 if horizontal, 1 if vertical, helps in detecting collisions later
    }

    displaySelf(){
        line(this.startX, this.startY, this.endX, this.endY);
    }

    detectCollisions(){
        if(this.direction == 0){ //if we are a horizontal line...
            if(playerY - this.startY == 0){ //check if player Y and line Y are equal
                if(playerX > min(this.startX, this.endX) && playerX < max(this.startX, this.endX)){ //check if player is between our two end points
                    resetLevel();
                } 
            }
        }
        else //if we are a vertical line
        {
            if(playerX - this.startX == 0){ //check if player Y and line Y are equal
                if(playerY > min(this.startY, this.endY) && playerY < max(this.startY, this.endY)){ //check if player is between our two end points
                    resetLevel();
                } 
            }
        }
    }
}