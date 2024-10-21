let canvasSize = 500;

//Player1 Variables
let player1X = canvasSize/2;
let player1Y = canvasSize - 55;
let player1XSpeed = 0;
let player1YSpeed = 0;
let player1MoveSpeed = 1.5;
let player1Direction = 4;
let player1Rotation = 90;
let p1XOffset = 0;
let p1YOffset = -20;

//Player1 Lines
let p1LineStartX = canvasSize/2;
let p1LineStartY = canvasSize - 45;
let p1LineEndX = 0;
let p1LineEndY = 0;

//Player2 Variables
let player2X = canvasSize/2;
let player2Y = 55;
let player2XSpeed = 0;
let player2YSpeed = 0;
let player2MoveSpeed = 1.5;
let player2Direction = 4;
let player2Rotation = 90;
let p2XOffset = 0;
let p2YOffset = -20;

//Player2 Lines
let p2LineStartX = canvasSize/2;
let p2LineStartY = 55;
let p2LineEndX = 0;
let p2LineEndY = 0;

let buffer;

function preload(){
    iPlayer1 = loadImage('images/player_char.png');
    iPlayer2 = loadImage('images/player_char.png');
}

function setup() {
    pixelDensity(1);
    createCanvas(canvasSize, canvasSize);
    noSmooth();
    angleMode(DEGREES); 
    background(0);

    buffer = createGraphics(canvasSize, canvasSize);
    buffer.strokeWeight(20);
    buffer.stroke(0);
    buffer.pixelDensity(1);
}


function draw(){
    imageMode(CORNER);
    background(0,0,0,60);
    image(buffer, 0, 0);
    imageMode(CENTER);

    //Movement Detection - PLAYER 1
    switch(player1Direction){
        case 0:
            //Forward
            player1XSpeed = 0;
            player1YSpeed = -1 * player1MoveSpeed;
            player1Rotation = 90;
            p1XOffset = 0;
            p1YOffset = -20;
            break;
        case 1:
            //Right
            player1XSpeed = 1 * player1MoveSpeed;
            player1YSpeed = 0;
            player1Rotation = 180;
            p1XOffset = 20;
            p1YOffset = 0;
            break;
        case  2:
            //Down
            player1XSpeed = 0;
            player1YSpeed = 1 * player1MoveSpeed;
            player1Rotation = 270;
            p1XOffset = 0;
            p1YOffset = 20;
            break;
        case 3:
            //Left
            player1XSpeed = -1 * player1MoveSpeed;
            player1YSpeed = 0;
            player1Rotation = 0;
            p1XOffset = -20;
            p1YOffset = 0;
            break;
        case 4:
            player1XSpeed = 0;
            player1YSpeed = 0;
            player1Rotation = 90;
            p1XOffset = 0;
            p1YOffset = -20;
    }

    player1X += player1XSpeed;
    player1Y += player1YSpeed;

    //P1 Line Drawing
    p1LineEndX = player1X;
    p1LineEndY = player1Y;
    stroke(140, 184, 255);
    strokeWeight(5);
    //draws the most recent line before it's saved
    line(p1LineStartX, p1LineStartY, p1LineEndX, p1LineEndY);
    
    
    //Player1 Display
    push();
    translate(player1X, player1Y);
    rotate(player1Rotation);
    image(iPlayer1, 0, 0, 48, 24);
    pop();

    //Player1 Collision Detection
    let p1DetectedColor = blue(buffer.get(player1X + p1XOffset, player1Y + p1YOffset));
    if(p1DetectedColor != 0){
        resetLevel();
    }
    if(player1X + p1XOffset >= canvasSize || player1X + p1XOffset <= 0
        || player1Y + p1YOffset >= canvasSize || player1Y + p1YOffset <= 0){
        resetLevel();
    }
    //Debug Detector
    //circle(playerX + detectorXOffset, playerY + detectorYOffset, 5);


    //Movement Detection - PLAYER 2
    switch(player2Direction){
        case 0:
            //Forward
            player2XSpeed = 0;
            player2YSpeed = -1 * player2MoveSpeed;
            player2Rotation = 90;
            p2XOffset = 0;
            p2YOffset = -20;
            break;
        case 1:
            //Right
            player2XSpeed = 1 * player2MoveSpeed;
            player2YSpeed = 0;
            player2Rotation = 180;
            p2XOffset = 20;
            p2YOffset = 0;
            break;
        case  2:
            //Down
            player2XSpeed = 0;
            player2YSpeed = 1 * player2MoveSpeed;
            player2Rotation = 270;
            p2XOffset = 0;
            p2YOffset = 20;
            break;
        case 3:
            //Left
            player2XSpeed = -1 * player2MoveSpeed;
            player2YSpeed = 0;
            player2Rotation = 0;
            p2XOffset = -20;
            p2YOffset = 0;
            break;
        case 4:
            player2XSpeed = 0;
            player2YSpeed = 0;
            player2Rotation = 270;
            p2XOffset = 0;
            p2YOffset = -20;
    }

    player2X += player2XSpeed;
    player2Y += player2YSpeed;

    //P1 Line Drawing
    p2LineEndX = player2X;
    p2LineEndY = player2Y;
    stroke(140, 184, 255);
    strokeWeight(5);
    //draws the most recent line before it's saved
    line(p2LineStartX, p2LineStartY, p2LineEndX, p2LineEndY);
    
    
    //Player1 Display
    push();
    translate(player2X, player2Y);
    rotate(player2Rotation);
    image(iPlayer2, 0, 0, 48, 24);
    pop();

    //Player1 Collision Detection
    let detectedColor = blue(buffer.get(player1X + p1XOffset, player1Y + p1YOffset));
    if(detectedColor != 0){
        resetLevel();
    }
    if(player2X + p2XOffset >= canvasSize || player2X + p2XOffset <= 0
        || player2Y + p2YOffset >= canvasSize || player2Y + p2YOffset <= 0){
        resetLevel();
    }
}

function keyPressed(){
    if(player1YSpeed == 0){ //This prevents 180 turns
        if(key === 'w'){
            saveP1Line();
            player1Direction = 0;
            
        }
        if(key === 's'){
            saveP1Line();
            player1Direction = 2;
            
        }
    }
    if(player1XSpeed == 0){
        if(key === 'd'){
            saveP1Line();
            player1Direction = 1;
            
        }
        if(key === 'a'){
            saveP1Line();
            player1Direction = 3;
            
        }
    }
}

function saveP1Line(){
    console.log('Registering new line.')
    buffer.stroke(140, 184, 255);
    buffer.strokeWeight(5);
    buffer.line(p1LineStartX, p1LineStartY, player1X, player1Y);
    
    //moves the goalposts
    p1LineStartX = player1X;
    p1LineStartY = player1Y;
}

function resetLevel(){
    //Reset Variables
    player1X = canvasSize/2;
    player1Y = canvasSize - 55;
    player1Direction = 4;

    p1LineStartX = canvasSize/2;
    p1LineStartY = canvasSize - 45;
    buffer = createGraphics(canvasSize, canvasSize);
}

/* OBSOLETE
class lightLine{
    constructor(x,y,a,b){
        this.startX = x;
        this.startY = y;
        this.endX = a;
        this.endY = b; //0 if horizontal, 1 if vertical, helps in detecting collisions later
    }

    displaySelf(){
        buffer.stroke(140, 184, 255);
        buffer.strokeWeight(5);
        buffer.line(this.startX, this.startY, this.endX, this.endY);
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
*/