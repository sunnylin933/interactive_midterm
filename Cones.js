let player;
let segments = [];
let bullets = [];
let explosions = [];
let segmentWidth = 20;
let segmentSpeed = 0.5;
let fallingAreaWidth = 200;
let uniformHeight = 60;
let shiftInterval = 60;
let cone;
let gameWon = false;
let frameCounter = 0;
let explosionAmount = 10;
let coneColor;
let colorChangeInterval = 120;
let player1Lives;
let player2Lives;
let activePlayer;
let player1Score;
let player2Score;
let startDelay;
let isGameActive;
let isTurnOver;
let winner;
let playerImg;

function setup() {
  createCanvas(500, 500);
  playerImg = loadImage('images/ConesImage.png'); // Replace with the actual path
  resetGame();
}

function resetGame() {
  player1Lives = 1;
  player2Lives = 1;
  player1Score = 0;
  player2Score = 0;
  activePlayer = 1;
  startDelay = 180;
  isGameActive = false;
  isTurnOver = false;
  winner = null;
  gameWon = false;
  frameCounter = 0;
  segments = [];
  bullets = [];
  explosions = [];
  setupPlayer();
  spawnSegments();
  spawnCone();
  coneColor = color(random(255), random(255), random(255));
}

function setupPlayer() {
  player = {
    x: width / 2,
    y: height - 100,
    size: 20,
    speed: 5
  };
}

function draw() {
  background(0);
  drawFallingArea();

  if (winner) {
    displayWinner();
  } else if (isTurnOver) {
    displayEndOfTurnMessage();
    startDelay--;
    if (startDelay <= 0) {
      endTurn();
    }
  } else if (startDelay > 0) {
    displayStartMessage();
    startDelay--;
  } else {
    isGameActive = true;
    handleSegments();
    handleBullets();
    handleExplosions();
    drawPlayer();
    handlePlayerMovement();
    checkCollisions();
    drawCone();

    if (gameWon) {
      if (activePlayer === 1) {
        player1Score++;
      } else {
        player2Score++;
      }
      isTurnOver = true;
      startDelay = 180;
    }

    frameCounter++;
    if (frameCounter % shiftInterval === 0) {
      shiftClusters();
    }

    if (frameCounter % colorChangeInterval === 0) {
      coneColor = color(random(255), random(255), random(255));
    }
  }

  displayScoresAndLives();
}

function displayStartMessage() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  textFont('Courier');
  text(`PLAYER ${activePlayer} START`, width / 2, height / 2);
}

function displayEndOfTurnMessage() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  textFont('Courier');
  text(`End of Turn: Player ${activePlayer}`, width / 2, height / 2);
}

function displayWinner() {
  fill(255, 0, 0);
  textSize(40);
  textAlign(CENTER, CENTER);
  textFont('Courier');
  text(winner === 0 ? `TIE GAME` : `WINNER: PLAYER ${winner}`, width / 2, height / 2);
}

function drawFallingArea() {
  stroke(255, 150);
  noFill();
  rect(width / 2 - fallingAreaWidth / 2, 0, fallingAreaWidth, height);
  noStroke();
}

function handleSegments() {
  for (let i = segments.length - 1; i >= 0; i--) {
    let segment = segments[i];
    segment.y += segmentSpeed;

    if (segment.height > 0) {
      fill(segment.color);
      rect(segment.x, segment.y, segmentWidth, segment.height);
    }

    if (segment.y > height || segment.height <= 0) {
      segments.splice(i, 1);
    }
  }
}

function handleBullets() {
  let leftBoundary = width / 2 - fallingAreaWidth / 2;
  let rightBoundary = width / 2 + fallingAreaWidth / 2;

  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;

    if (bullet.x <= leftBoundary || bullet.x >= rightBoundary) {
      bullet.vx *= -1;
    }

    fill(255, 0, 255);
    ellipse(bullet.x, bullet.y, 5, 5);

    if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
      bullets.splice(i, 1);
    }
  }
}

function spawnSegments() {
  let numSegments = Math.ceil(fallingAreaWidth / segmentWidth);

  for (let i = 0; i < numSegments; i++) {
    let angle = (i / numSegments) * PI;
    let curveOffset = sin(angle) * 50;

    segments.push({
      x: width / 2 - fallingAreaWidth / 2 + i * segmentWidth,
      y: -uniformHeight + curveOffset,
      width: segmentWidth,
      height: uniformHeight,
      color: generateDistinctColor(i, numSegments)
    });
  }
}

function shiftClusters() {
  for (let i = segments.length - 1; i >= 0; i--) {
    segments[i].x += segmentWidth;

    if (segments[i].x >= width / 2 + fallingAreaWidth / 2) {
      segments[i].x = width / 2 - fallingAreaWidth / 2;
    }

    segments[i].color = color(random(255), random(255), random(255));
  }
}

function generateDistinctColor(index, total) {
  let hueValue = (index / total) * 360 + random(-30, 30);
  return color(`hsl(${hueValue}, 100%, 50%)`);
}

function spawnCone() {
  cone = {
    x: width / 2,
    y: -uniformHeight - 30,
    width: fallingAreaWidth,
    height: 30,
    speed: segmentSpeed
  };
}

function drawCone() {
  let numLayers = 15;
  let layerHeight = 5;
  let baseWidth = fallingAreaWidth;
  let coneX = cone.x;
  let coneY = cone.y;

  fill(coneColor);
  noStroke();

  for (let i = 0; i < numLayers; i++) {
    let layerWidth = map(i, 0, numLayers - 1, baseWidth, 0);
    rect(coneX - layerWidth / 2, coneY - i * layerHeight, layerWidth, layerHeight);
  }

  cone.y += cone.speed;
}

function drawPlayer() {
  imageMode(CENTER);
  image(playerImg, player.x, player.y, player.size * 2, player.size * 2);
}

function handlePlayerMovement() {
  if (keyIsDown(65)) {
    player.x -= player.speed;
  }
  if (keyIsDown(68)) {
    player.x += player.speed;
  }
  if (keyIsDown(87)) {
    player.y -= player.speed;
  }
  if (keyIsDown(83)) {
    player.y += player.speed;
  }

  let leftBoundary = width / 2 - fallingAreaWidth / 2;
  let rightBoundary = width / 2 + fallingAreaWidth / 2;
  player.x = constrain(player.x, leftBoundary, rightBoundary - player.size);
}

function mousePressed() {
  let angle = atan2(mouseY - player.y, mouseX - player.x);
  let bullet = {
    x: player.x,
    y: player.y,
    vx: cos(angle) * 5,
    vy: sin(angle) * 5
  };
  bullets.push(bullet);
}

function checkCollisions() {
  // Check for player collision with each segment
  for (let i = segments.length - 1; i >= 0; i--) {
    let segment = segments[i];
    if (
      player.x + player.size / 2 > segment.x &&
      player.x - player.size / 2 < segment.x + segment.width &&
      player.y + player.size / 2 > segment.y &&
      player.y - player.size / 2 < segment.y + segment.height
    ) {
      // If player collides with a segment, they lose a life and the turn ends
      if (activePlayer === 1) {
        player1Lives--;
      } else {
        player2Lives--;
      }
      isTurnOver = true;
      startDelay = 180;
      return; // Exit immediately to prevent further actions in this frame
    }
  }

  // Check if the player reached the cone area successfully
  if (
    player.x > cone.x - cone.width / 2 &&
    player.x < cone.x + cone.width / 2 &&
    player.y > cone.y &&
    player.y < cone.y + cone.height
  ) {
    gameWon = true;
  }

  // Check bullet collisions with segments
  for (let i = segments.length - 1; i >= 0; i--) {
    let segment = segments[i];
    for (let j = bullets.length - 1; j >= 0; j--) {
      let bullet = bullets[j];
      checkBulletCollisions(bullet);
    }
  }
}


function checkBulletCollisions(bullet) {
  for (let i = segments.length - 1; i >= 0; i--) {
    let segment = segments[i];
    if (
      bullet.x >= segment.x &&
      bullet.x <= segment.x + segment.width &&
      bullet.y >= segment.y &&
      bullet.y <= segment.y + segment.height
    ) {
      segment.height -= explosionAmount;
      if (segment.height <= 0) segments.splice(i, 1);
      
      // Spawn explosion effect
      createExplosion(bullet.x, bullet.y);

      bullets.splice(bullets.indexOf(bullet), 1);
      return;
    }
  }
}

// Function to create explosion effect
function createExplosion(x, y) {
  for (let i = 0; i < 10; i++) {
    explosions.push({
      x: x,
      y: y,
      vx: random(-2, 2),
      vy: random(-2, 2),
      alpha: 255
    });
  }
}

// Function to handle explosions
function handleExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    let explosion = explosions[i];
    fill(255, explosion.alpha, 0, explosion.alpha);
    noStroke();
    ellipse(explosion.x, explosion.y, 5, 5);
    
    // Update position and fade out
    explosion.x += explosion.vx;
    explosion.y += explosion.vy;
    explosion.alpha -= 10;
    
    if (explosion.alpha <= 0) {
      explosions.splice(i, 1);
    }
  }
}

function displayScoresAndLives() {
  fill(255);
  textSize(16);
  textAlign(LEFT);

  // Display lives and scores for Player 1
  text(`Player 1 Score: ${player1Score}`, 10, 20);

  // Display lives and scores for Player 2
  text(`Player 2 Score: ${player2Score}`, 10, 40);

  // Display the active player
  textAlign(RIGHT);
  text(`Turn: Player ${activePlayer}`, width - 10, 20);
}
function endTurn() {
  gameWon = false;
  segments = [];
  bullets = [];
  spawnSegments();
  spawnCone();
  setupPlayer();
  frameCounter = 0;
  isGameActive = false;
  isTurnOver = false;
  startDelay = 180;

  if (activePlayer === 1) {
    activePlayer = 2;
  } else {
    activePlayer = 1;
    if (player1Lives === 0 && player2Lives === 0) {
      winner = 0; // Tie
    } else if (player1Lives === 0) {
      winner = 2; // Player 2 wins
    } else if (player2Lives === 0) {
      winner = 1; // Player 1 wins
    }
  }
}
