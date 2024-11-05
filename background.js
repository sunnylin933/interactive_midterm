//Game Variables
let counter = 0;
let counterMax = 1;
let droppers = [];
let isPlayingAudio = false;

function preload(){
    iHealth1 = loadImage('images/p1_heart.png');
    iHealth2 = loadImage('images/p2_heart.png');
    fBase = loadFont('fonts/base.ttf');
    sBGM = loadSound('sounds/bgm.wav')
}

function setup(){
    let canvas = createCanvas(1000, 1000);
    canvas.id('backgroundCanvas');
    noStroke();
    canvas.elt.style.width = '';
    canvas.elt.style.height = '';
    rectMode(CENTER);

    counterMax = random(1,5);
    sBGM.setVolume(0.25);
    sBGM.loop();

    let button = createButton('BGM Toggle');
    button.position(10,10);
    button.mousePressed(toggleSound);
}

function draw(){
    background(30, 26, 33, 50);
    counter++;
    if(counter>=counterMax){
        droppers.push(new Dropper(random(0,1000), random(-40, -80)));
        droppers.push(new Dropper(random(0,1000), random(-40, -80)));
        droppers.push(new Dropper(random(0,1000), random(-40, -80)));
        counter = 0;
    }

    for(let i = 0; i < droppers.length; i++){
        droppers[i].display();
    }

}

class Dropper{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = random(15,20);
        this.speed = random(1,4);
    }

    display(){
        fill(72, 50, 77, 220);
        this.size -= 0.05;
        this.y += this.speed;
        //fill(89, 65, 94);
        rect(this.x, this.y, this.size, this.size);
        
        // rect(this.x, this.y - this.size, this.size * 0.85, this.size * 0.85);
        // fill(52, 34, 56);
        // rect(this.x, this.y - (this.size*2), this.size * 0.5, this.size * 0.5);

        if(this.y >= 1000 + 10 || this.size <= 0){
            droppers.splice(droppers.indexOf(this),1);
        }
    }
}

function toggleSound(){
    if(!isPlayingAudio){
        
        sBGM.loop();
        isPlayingAudio = true;
    }
    else
    {
        sBGM.stop();
        isPlayingAudio = false;
    }
}