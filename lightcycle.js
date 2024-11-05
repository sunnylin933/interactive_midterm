//Game Variables
let canvasSize = 500;
let isReady1 = false;
let isReady2 = false;
let isReadyChecked = false;
let isPlaying = false;
let isGameEnd = false;
let isEnding = false;
let playerWon;

//Player1 Variables
let player1X = canvasSize / 2;
let player1Y = canvasSize - 55;
let player1XSpeed = 0;
let player1YSpeed = 0;
let player1MoveSpeed = 1.5;
let player1Direction = 0;
let player1Rotation = 90;
let p1XOffset = 0;
let p1YOffset = -20;

//Player1 Lines
let p1LineStartX = canvasSize / 2;
let p1LineStartY = canvasSize - 45;
let p1LineEndX = 0;
let p1LineEndY = 0;

//Player2 Variables
let player2X = canvasSize / 2;
let player2Y = 55;
let player2XSpeed = 0;
let player2YSpeed = 0;
let player2MoveSpeed = 1.5;
let player2Direction = 2;
let player2Rotation = 270;
let p2XOffset = 0;
let p2YOffset = -20;

//Player2 Lines
let p2LineStartX = canvasSize / 2;
let p2LineStartY = 55;
let p2LineEndX = 0;
let p2LineEndY = 0;

let buffer;

function preload() {
    iPlayer1 = loadImage('images/player_char_1.png');
    iPlayer2 = loadImage('images/player_char_2.png');
    fBase = loadFont('fonts/base.ttf');
    sLightcycle = loadSound('sounds/lightcycle.wav');
    sCrash = loadSound('sounds/crash.wav');
}

function setup() {
    pixelDensity(1);
    createCanvas(canvasSize, canvasSize);

    noSmooth();
    angleMode(DEGREES);
    textAlign(CENTER);
    background(0);
    strokeCap(SQUARE);
    textFont(fBase);

    buffer = createGraphics(canvasSize, canvasSize);
    buffer.strokeWeight(20);
    buffer.stroke(0);
    buffer.pixelDensity(1);
    sLightcycle.setVolume(0.1);
}


function draw() {
    imageMode(CORNER);
    background(0, 0, 0, 60);
    image(buffer, 0, 0);
    imageMode(CENTER);

    //Game Ready Check
    if (isReady1 && isReady2 && !isReadyChecked && !isGameEnd) {
        setTimeout(function () {
            isPlaying = true;
            sLightcycle.loop();
        }, 2000);
        isReadyChecked = true;
    }

    //Player1 Line Drawing
    p1LineEndX = player1X;
    p1LineEndY = player1Y;

    strokeWeight(6);
    buffer.strokeWeight(6);
    stroke(140, 184, 255);
    line(p1LineStartX, p1LineStartY, p1LineEndX, p1LineEndY);
    buffer.stroke(140, 184, 255);
    buffer.line(p1LineStartX, p1LineStartY, p1LineEndX, p1LineEndY);

    //Player2 Line Drawing
    p2LineEndX = player2X;
    p2LineEndY = player2Y;
    buffer.stroke(252, 255, 105);
    stroke(252, 255, 105);
    line(p2LineStartX, p2LineStartY, p2LineEndX, p2LineEndY);
    buffer.line(p2LineStartX, p2LineStartY, p2LineEndX, p2LineEndY);

    if (isPlaying) {
        switch (player1Direction) {
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
            case 2:
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
        }

        //Movement Detection - PLAYER 2
        switch (player2Direction) {
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
            case 2:
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
        }

        player1X += player1XSpeed;
        player1Y += player1YSpeed;
        player2X += player2XSpeed;
        player2Y += player2YSpeed;

        //Player1 Collision Detection
        let p1DetectedColor = red(buffer.get(player1X + p1XOffset, player1Y + p1YOffset));
        let p1Collider2 = red(buffer.get(player1X + p1XOffset/2, player1Y+ p1YOffset/2));
        //ellipse(player1X + p1XOffset, player1Y + p1YOffset, 10);
        if (p1DetectedColor != 0 || p1Collider2 != 0) {
            endLevel(1);
        }
        if (player1X + p1XOffset >= canvasSize || player1X + p1XOffset <= 0
            || player1Y + p1YOffset >= canvasSize || player1Y + p1YOffset <= 0) {
            endLevel(1);
        }

        //Player2 Collision Detection
        let p2DetectedColor = blue(buffer.get(player2X + p2XOffset, player2Y + p2YOffset));
        let p2Collider2 =  blue(buffer.get(player2X + p2XOffset/2, player2Y + p2YOffset/2));
        //ellipse(player2X + p2XOffset, player2Y + p2YOffset, 10);
        if (p2DetectedColor != 0 || p2Collider2 != 0) {
            endLevel(2);
        }
        if (player2X + p2XOffset >= canvasSize || player2X + p2XOffset <= 0
            || player2Y + p2YOffset >= canvasSize || player2Y + p2YOffset <= 0) {
            endLevel(2);
        }
    }
    else {
        if (!isGameEnd) {
            noStroke();
            textSize(22);
            if (!isReady2) {
                fill(255);
                text('NOT READY', canvasSize / 2, 120);
            }
            else {
                fill(22, 128, 0);
                text('READY', canvasSize / 2, 120);
            }

            if (!isReady1) {
                fill(255);
                text('NOT READY', canvasSize / 2, canvasSize - 110);
            }
            else {
                fill(22, 128, 0);
                text('READY', canvasSize / 2, canvasSize - 110);
            }

            if (isReady1 && isReady2 && !isPlaying) {
                fill(255);
                textSize(28);
                text('GET READY', canvasSize / 2, canvasSize / 2);
            }
        }
    }

    //Player1 Display
    push();
    translate(player1X, player1Y);
    rotate(player1Rotation);
    image(iPlayer1, 0, 0, 48, 24);
    pop();

    //Player2 Display
    push();
    translate(player2X, player2Y);
    rotate(player2Rotation);
    image(iPlayer2, 0, 0, 48, 24);
    pop();

    if(isGameEnd){
        fill(0,0,0,180);
        strokeWeight(15);
        textSize(40);
        if(playerWon == 1){
            stroke(140, 184, 255);
            rect(0,0,canvasSize);
            noStroke();
            fill(140, 184, 255);
            text('Player 1 Wins!', canvasSize/2, canvasSize/2);
            if(!isEnding){
                window.parent.endGame(2);
                isEnding = true;
            }
        }
        else if(playerWon == 2){
            stroke(252, 255, 105);
            rect(0,0,canvasSize);
            noStroke();
            fill(252, 255, 105);
            text('Player 2 Wins!', canvasSize/2, canvasSize/2);
            if(!isEnding){
                window.parent.endGame(1);
                isEnding = true;
            }
        }
    }
}

function keyPressed() {
    if (isPlaying) {
        //Player 1
        if (player1YSpeed == 0) { //This prevents 180 turns
            if (key === 'w') {
                saveLine(1);
                player1Direction = 0;

            }
            if (key === 's') {
                saveLine(1);
                player1Direction = 2;

            }
        }
        if (player1XSpeed == 0) {
            if (key === 'd') {
                saveLine(1);
                player1Direction = 1;

            }
            if (key === 'a') {
                saveLine(1);
                player1Direction = 3;

            }
        }

        //Player 2
        if (player2YSpeed == 0) { //This prevents 180 turns
            if (key === 'i') {
                saveLine(2);
                player2Direction = 0;

            }
            if (key === 'k') {
                saveLine(2);
                player2Direction = 2;

            }
        }
        if (player2XSpeed == 0) {
            if (key === 'l') {
                saveLine(2);
                player2Direction = 1;

            }
            if (key === 'j') {
                saveLine(2);
                player2Direction = 3;

            }
        }
    }
    else {
        if (!isGameEnd) {
            //Ready Checks
            if (key === 'i' || key === 'l' || key === 'k' || keyCode === 'j') {
                isReady2 = true;
            }

            if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
                isReady1 = true;
            }
        }
    }
}

function saveLine(player) {
    console.log('Registering new line.')
    if (player == 1) {
        buffer.stroke(140, 184, 255);
        buffer.strokeWeight(5);
        buffer.line(p1LineStartX, p1LineStartY, player1X, player1Y);

        //moves the goalposts
        p1LineStartX = player1X;
        p1LineStartY = player1Y;
    }

    if (player == 2) {
        buffer.stroke(252, 255, 105);
        buffer.strokeWeight(5);
        buffer.line(p2LineStartX, p2LineStartY, player2X, player2Y);

        //moves the goalposts
        p2LineStartX = player2X;
        p2LineStartY = player2Y;
    }
}

function endLevel(losingPlayer) {
    sLightcycle.stop();
    sCrash.play();
    console.log('Game Ended');
    isPlaying = false;
    isGameEnd = true;
    playerWon = 3 - losingPlayer;

    textSize(20);
    fill(255);
    //Reset Variable
}

function resetGame(){
    background(0);
    isReady1 = false;
    isReady2 = false;
    isReadyChecked = false;
    isPlaying = false;
    isGameEnd = false;
    isEnding = false;
    playerWon = 0;
    player1X = canvasSize / 2;
    player1Y = canvasSize - 55;
    player1XSpeed = 0;
    player1YSpeed = 0;
    player1MoveSpeed = 1.5;
    player1Direction = 0;
    player1Rotation = 90;
    p1XOffset = 0;
    p1LineStartX = canvasSize / 2;
    p1LineStartY = canvasSize - 45;
    p1LineEndX = 0;
    p1LineEndY = 0;
    player2X = canvasSize / 2;
    player2Y = 55;
    player2XSpeed = 0;
    player2YSpeed = 0;
    player2MoveSpeed = 1.5;
    player2Direction = 2;
    player2Rotation = 270;
    p2XOffset = 0;
    p2YOffset = -20;
    p2LineStartX = canvasSize / 2;
    p2LineStartY = 55;
    p2LineEndX = 0;
    p2LineEndY = 0;
    buffer = createGraphics(canvasSize, canvasSize);
}