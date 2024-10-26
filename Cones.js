let player;
let segments = [];
let bullets = [];
let segmentWidth = 20; // Width of each segment
let segmentSpeed = 0.5; // Slow falling speed
let fallingAreaWidth = 200; // Width of the falling area
let uniformHeight = 60; // Initial uniform height for all segments
let shiftInterval = 60; // Frames between shifting clusters to the right
let cone;
let gameWon = false; // To track if the player has won
let frameCounter = 0; // Counter to track frame shifts
let explosionAmount = 10; // Amount to reduce the height of a segment upon bullet impact

function setup() {
  createCanvas(800, 600);
  player = {
    x: width / 2,
    y: height - 100,
    size: 20,
    speed: 5
  };
  spawnSegments(); // Spawn clusters only once
  spawnCone(); // Spawn the cone above the clusters
}

function draw() {
  background(0);
  drawFallingArea();
  handleSegments();
  handleBullets();
  drawPlayer();
  handlePlayerMovement();
  checkCollisions();
  drawCone();

  if (gameWon) {
    displayWinMessage();
  }

  // Increment frame counter and shift clusters at the specified interval
  frameCounter++;
  if (frameCounter % shiftInterval === 0) {
    shiftClusters();
  }
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

    // Draw the segment if it still has height
    if (segment.height > 0) {
      fill(segment.color);
      rect(segment.x, segment.y, segmentWidth, segment.height);
    }

    // Remove segments that have fallen off the screen or no longer have height
    if (segment.y > height || segment.height <= 0) {
      segments.splice(i, 1);
    }
  }
}

function handleBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    bullet.y -= 5; // Move the bullet upward

    // Draw the bullet
    fill(255, 0, 255);
    ellipse(bullet.x, bullet.y, 5, 5);

    // Remove bullets that go off the screen
    if (bullet.y < 0) {
      bullets.splice(i, 1);
    }
  }
}

function spawnSegments() {
  let numSegments = Math.ceil(fallingAreaWidth / segmentWidth); // Calculate the number of segments needed

  for (let i = 0; i < numSegments; i++) {
    // Create a curved effect using a sine wave for the y-position
    let angle = (i / numSegments) * PI; // Angle for sine wave
    let curveOffset = sin(angle) * 50; // Amplitude of the curve

    segments.push({
      x: width / 2 - fallingAreaWidth / 2 + i * segmentWidth,
      y: -uniformHeight + curveOffset, // Apply the curve effect to the y-position
      width: segmentWidth,
      height: uniformHeight, // Set uniform height for all segments
      color: generateDistinctColor(i, numSegments) // Generate distinct colors for each segment
    });
  }
}

function shiftClusters() {
  // Shift each segment to the right
  for (let i = segments.length - 1; i >= 0; i--) {
    segments[i].x += segmentWidth;
    // If the segment goes past the right edge, wrap it to the left
    if (segments[i].x >= width / 2 + fallingAreaWidth / 2) {
      segments[i].x = width / 2 - fallingAreaWidth / 2;
    }
  }
}

function generateDistinctColor(index, total) {
  // Create a color with some variation to make it distinct from its neighbors
  let hueValue = (index / total) * 360 + random(-30, 30);
  return color(`hsl(${hueValue}, 100%, 50%)`);
}

function spawnCone() {
  cone = {
    x: width / 2,
    y: -uniformHeight - 30, // Position above the segments
    width: fallingAreaWidth,
    height: 30, // Height of the cone
    speed: segmentSpeed, // Move with the segments
    color: color(random(255), random(255), random(255)) // Random color for the cone
  };
}

function drawCone() {
  // Draw the cone spanning the entire width of the clusters
  fill(cone.color);
  rect(cone.x - cone.width / 2, cone.y, cone.width, cone.height);

  // Move the cone down
  cone.y += cone.speed;
}

function drawPlayer() {
  fill(0, 255, 255);
  ellipse(player.x, player.y, player.size, player.size);
}

function handlePlayerMovement() {
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.x += player.speed;
  }
  if (keyIsDown(UP_ARROW)) {
    player.y -= player.speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    player.y += player.speed;
  }

  // Constrain the player within the falling area
  let leftBoundary = width / 2 - fallingAreaWidth / 2;
  let rightBoundary = width / 2 + fallingAreaWidth / 2;
  player.x = constrain(player.x, leftBoundary, rightBoundary - player.size);
}

function keyPressed() {
  if (key === ' ') {
    // Shoot a bullet
    bullets.push({
      x: player.x,
      y: player.y
    });
  }
}

function checkCollisions() {
  for (let i = segments.length - 1; i >= 0; i--) {
    let segment = segments[i];

    // Check collision between bullets and segments
    for (let j = bullets.length - 1; j >= 0; j--) {
      let bullet = bullets[j];
      if (
        bullet.x > segment.x &&
        bullet.x < segment.x + segment.width &&
        bullet.y > segment.y &&
        bullet.y < segment.y + segment.height
      ) {
        // Reduce the height of the segment when hit
        segment.height -= explosionAmount;
        bullets.splice(j, 1); // Remove the bullet

        // Stop checking further collisions for this bullet
        break;
      }
    }
  }

  // Check collision between player and the cone
  if (
    player.x > cone.x - cone.width / 2 &&
    player.x < cone.x + cone.width / 2 &&
    player.y > cone.y &&
    player.y < cone.y + cone.height
  ) {
    gameWon = true;
  }

  // Check collision between player and segments
  for (let segment of segments) {
    if (
      player.x > segment.x &&
      player.x < segment.x + segment.width &&
      player.y > segment.y &&
      player.y < segment.y + segment.height
    ) {
      resetGame();
    }
  }
}

function displayWinMessage() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("You Win!", width / 2, height / 2);
  noLoop(); // Stop the game
}

function resetGame() {
  player.x = width / 2;
  player.y = height - 100;
  segments = [];
  bullets = [];
  gameWon = false;
  spawnSegments();
  spawnCone();
  frameCounter = 0; // Reset the frame counter
  loop(); // Restart the game if it was stopped
}
