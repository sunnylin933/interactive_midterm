//Game Variables
let canvasSize = 500;

function preload(){
    iHealth1 = loadImage('images/p1_heart.png');
    iHealth2 = loadImage('images/p2_heart.png');
    fBase = loadFont('fonts/base.ttf');
}

function setup(){
    let canvas = createCanvas(canvasSize, 75);
    background(0);
    imageMode(CENTER);
    textFont(fBase);
    textAlign(CENTER);
}

function draw(){
    background(0);

    textSize(18);
    fill(176, 229, 255);
    text('Player 1 Lives:', 100, 25);
    fill(255, 241, 176);
    text('Player 2 Lives:', 390, 25);
    for(let i = 0; i < window.parent.p1Lives; i++){
        image(iHealth1, 50 + i*32, 45, 32, 32);
    }
    for(let i = 0; i < window.parent.p2Lives; i++){
        image(iHealth2, 380 + i*32, 45, 32, 32);
    }

}