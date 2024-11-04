p5.disableFriendlyErrors = true;

//Environmental variables
let audioPlayer;
let jumpSound;
let enemyDeathSound;
let attackSound;
let playerDeathSound;
//Day/Night-cycle
let dayDuration = 60.6;
let nightDuration = 59.4;
let totalCycleDuration;
let cycleProgress = 0;
let bgColor;
//Clouds
let clouds = [];
//Frame variables
let ground;
let canvasHeight;
let canvasWidth;

//Platform variables
let platforms = [];
let platformTop;
let platformY;
let platformX;

//Player variables
//Global Player variables
//movement
let fallSpeed = 4;
let moveSpeed = 2;
let maxJumpHeight = 100;
//sizes
let size = 50;
let halfSize = size / 2;
//attack
let attackPower = 1;
//respawn
let respawnTime = 180;

//P1 variables
let P1Grounded = false;
let P1Y;
let P1X;

//P1 health
let P1Health = 3;
let P1Alive = true;

//Respawn P1
let P1RespawnTimer = 0;

//P1 movement variables
let P1JumpCounter = 0;
let P1JumpCd = 0;
let P1Jumping = false;

// P1 attack variables
let P1AttackCd = 0;
let P1IsAttacking = false;
let P1HasHitP2 = false;

//P2 variables
let P2Grounded = false;
let P2Y;
let P2X;

//P2 health
let P2Health = 3;
let P2Alive = true;

//Respawn P2
let P2RespawnTimer = 0;

//P2 movement variables
let P2JumpCounter = 0;
let P2JumpCd = 0;
let P2Jumping = false;

// P2 attack variables
let P2AttackCd = 0;
let P2IsAttacking = false;
let P2HasHitP1 = false;

//Time variables
let frame = 0;
let second = 0;
let minute = 0;
let hour = 0;
let day = 0;

//Tree variables
let trees = [];
let treeAmount = 20;

//Other variables
let name;

//Functions
function preload() {
  audioPlayer = createAudio("./audio/Coffee.mp3");
  jumpSound = createAudio("./audio/jump-sfx.mp3");
  attackSound = createAudio("./audio/Attack.mp3");
  playerDeathSound = createAudio("./audio/Player-death.mp3");
  enemyDeathSound = createAudio("./audio/Enemy-death.mp3");
}

function setup() {
  canvasHeight = windowHeight - 50;
  ground = canvasHeight;
  canvasWidth = windowWidth - 50;
  createCanvas(canvasWidth, canvasHeight);
  soundSetup();
  //playerer positions
  P1X = random(50, canvasWidth - 50);
  P1Y = (windowHeight - 50) * 0.9;

  P2X = random(50, canvasWidth - 50);
  P2Y = (windowHeight - 50) * 0.9;

  initializeDayNightCycle();
  createClouds();
  createTreeLocations();

  frameRate(60);

  //Platform setup
  /*{ x: canvasWidth, y: canvasHeight, width: 150, height: 20 },*/

  platforms = [
    { x: canvasWidth / 6, y: canvasHeight / 1.9, width: 150, height: 20 },
    { x: canvasWidth / 2.4, y: canvasHeight / 1.7, width: 200, height: 20 },
    { x: canvasWidth / 1.7, y: canvasHeight / 2.9, width: 150, height: 20 },
    { x: canvasWidth / 1.5, y: canvasHeight / 1.3, width: 200, height: 20 },
    { x: canvasWidth / 1.2, y: canvasHeight / 2, width: 200, height: 20 },
  ];
}

function draw() {
  applyAmbientLight();
  updateDayNightCycle();
  document.body.style.backgroundColor = bgColor;
  background(bgColor);

  //background elements
  noStroke();
  drawTrees();
  drawStars();
  drawSunMoon();
  drawClouds();

  //Platforms
  stroke("black");
  strokeWeight(1);
  createPlatforms();

  //Utilities
  checkAttackOnP2();
  checkAttackOnP1();
  P1Movement();
  P2Movement();
  gravity();
  P1ColliderCheck();
  P2ColliderCheck();

  //Characters
  if (P2Alive) {
    createP2();
  } else if (!P2Alive) {
    respawnP2();
  }
  if (P1Alive) {
    createP1();
  } else if (!P1Alive) {
    respawnP1();
  }
}

function windowResized() {
  canvasHeight = windowHeight - 50;
  canvasWidth = windowWidth - 50;
  resizeCanvas(canvasWidth, canvasHeight);
  x = (windowWidth - 50) / 2;
  y = (windowHeight - 50) * 0.9;
  createPlatforms();
}

function gravity() {
  if (P1Grounded == false) {
    P1Y += fallSpeed;
  }
  if (P2Grounded == false) {
    P2Y += fallSpeed;
  }
}

//Movement
//Player movement
//P1
function P1Movement() {
  //Left (A)
  if (keyIsDown(65) && P1X > 0 + halfSize) {
    P1X -= moveSpeed;
  }
  //Right (D)
  if (keyIsDown(68) && P1X < canvasWidth - halfSize) {
    P1X += moveSpeed;
  }
  //Jump (W)
  if (keyIsDown(87) && P1Grounded && P1JumpCd === 0) {
    jumpSound.play();
    P1Jumping = true;
    P1JumpCd = 20;
    P1JumpCounter = maxJumpHeight;
    P1Grounded = false;
  }
  if (P1Jumping) {
    let jumpSpeed = map(P1JumpCounter, 0, maxJumpHeight, 1, 10);
    P1Y -= jumpSpeed;
    P1JumpCounter--;

    if (P1JumpCounter <= 0) {
      P1Jumping = false;
    }
  }

  //Jump cooldown
  if (P1JumpCd > 0 && P1Grounded == true) {
    P1JumpCd--;
  }

  //Attack (Space)
  if (keyIsDown(32) && P1AttackCd === 0) {
    P1IsAttacking = true;
    P1AttackCd = 120;
  }

  //Attack cooldown (prevents instakilling the enemy (Oops))
  if (P1AttackCd > 0) {
    P1AttackCd--;
    if (P1AttackCd === 0) {
      P1IsAttacking = false;
      P1HasHitP2 = false;
    }
  }
}
//P2 movement
function P2Movement() {
  //Left (Left arrow)
  if (keyIsDown(37) && P2X > 0 + halfSize) {
    P2X -= moveSpeed;
  }
  //Right (Right arrow)
  if (keyIsDown(39) && P2X < canvasWidth - halfSize) {
    P2X += moveSpeed;
  }
  //Jump (Up arrow)
  if (keyIsDown(38) && P2Grounded && P2JumpCd === 0) {
    jumpSound.play();
    P2Jumping = true;
    P2JumpCd = 20;
    P2JumpCounter = maxJumpHeight;
    P2Grounded = false;
  }
  if (P2Jumping) {
    let jumpSpeed = map(P2JumpCounter, 0, maxJumpHeight, 1, 10);
    P2Y -= jumpSpeed;
    P2JumpCounter--;

    if (P2JumpCounter <= 0) {
      P2Jumping = false;
    }
  }

  //Jump cooldown
  if (P2JumpCd > 0 && P2Grounded == true) {
    P2JumpCd--;
  }

  //Attack (Space)
  if (keyIsDown(17) && P2AttackCd === 0) {
    P2IsAttacking = true;
    P2AttackCd = 120;
  }

  //Attack cooldown (prevents instakilling the enemy (Oops))
  if (P2AttackCd > 0) {
    P2AttackCd--;
    if (P2AttackCd === 0) {
      P2sAttacking = false;
      P2HasHitP1 = false;
    }
  }
}

/*Attack
//P1*/
function checkAttackOnP2() {
  if (P1IsAttacking && P2Alive && !P1HasHitP2) {
    let distanceX = Math.abs(P1X - P2X);
    let distanceY = Math.abs(P1Y - P2Y);

    if (distanceX < halfSize * 2 && distanceY < halfSize * 2) {
      attackSound.play();
      P2Health -= attackPower;
      P1HasHitP2 = true;
      console.log(`P2 Health: ${P2Health}`);

      if (P2Health <= 0) {
        playerDeathSound.play();
        P2Alive = false;
        console.log("P2 is dead!");
      }
    }
  }
}
//P2
function checkAttackOnP1() {
  if (P2IsAttacking && P1Alive && !P2HasHitP1) {
    let distanceX = Math.abs(P2X - P1X);
    let distanceY = Math.abs(P2Y - P1Y);

    if (distanceX < halfSize * 2 && distanceY < halfSize * 2) {
      attackSound.play();
      P1Health -= attackPower;
      P2HasHitP1 = true;
      console.log(`P1 Health: ${P1Health}`);

      if (P1Health <= 0) {
        playerDeathSound.play();
        P1Alive = false;
        console.log("P1 is dead!");
      }
    }
  }
}

//Respawn enemy
//P1
function respawnP1() {
  if (!P1Alive) {
    P1RespawnTimer++;
    if (P1RespawnTimer >= respawnTime) {
      P1Health = 3;
      P1X = random(50, canvasWidth - 50);
      P1Y = ground - halfSize;
      console.log("P1 respawned at X:", P1X, "Y:", P1Y);
      P1Alive = true;
      P1RespawnTimer = 0;
    }
  }
}
//P2
function respawnP2() {
  if (!P2Alive) {
    P2RespawnTimer++;
    if (P2RespawnTimer >= respawnTime) {
      P2Health = 3;
      P2X = random(50, canvasWidth - 50);
      P2Y = ground - halfSize;
      console.log("P2 respawned at X:", P2X, "Y:", P2Y);
      P2Alive = true;
      P2RespawnTimer = 0;
    }
  }
}

//Already made still not used
function timer() {
  frame++;
  if (frame >= 60) {
    second++;
    frame = 0;
    if (second >= 60) {
      minute++;
      second = 0;
      if (minute >= 60) {
        hour++;
        minute = 0;
        if (hour >= 24) {
          day++;
          hour = 0;
        }
      }
    }
  }
  console.log(
    `This log has been going on for ${day} day(s), ${hour} hour(s), ${minute} minutes, ${second} second(s)`
  );
}

//Platforms
function createPlatforms() {
  for (let platform of platforms) {
    fill(100, 200, 100);
    rect(
      platform.x - platform.width / 2,
      platform.y,
      platform.width,
      platform.height
    );
  }
}

//Colliders
//Player colliders
function P1ColliderCheck() {
  P1Grounded = false;
  //ground collision
  if (Math.floor(P1Y) >= Math.floor(ground - halfSize)) {
    P1Grounded = true;
  }
  for (let platform of platforms) {
    //top platform collision (to stand on the platform)
    if (
      P1Y + halfSize >= platform.y &&
      P1Y + halfSize <= platform.y + platform.height &&
      P1X + halfSize - 1 >= platform.x - platform.width / 2 &&
      P1X - halfSize + 1 <= platform.x + platform.width / 2 &&
      !P1Jumping
    ) {
      P1Y = platform.y - halfSize;
      P1Grounded = true;
      return;
    }
    //bottom platform collision
    if (
      P1Y - halfSize <= platform.y + platform.height &&
      P1Y - halfSize >= platform.y &&
      P1X + halfSize - 1 >= platform.x - platform.width / 2 &&
      P1X - halfSize - 1 <= platform.x + platform.width / 2
    ) {
      P1Y = platform.y + platform.height + halfSize;
      P1Jumping = false;
    }
    //side platform collision
    if (
      P1X + halfSize >= platform.x - platform.width / 2 &&
      P1X - halfSize <= platform.x + platform.width / 2 &&
      P1Y + halfSize > platform.y &&
      P1Y - halfSize < platform.y + platform.height
    ) {
      //left
      if (
        P1X < platform.x &&
        P1X + halfSize > platform.x - platform.width / 2 &&
        !(P1Y < platform.y)
      ) {
        P1X = platform.x - platform.width / 2 - halfSize;
      }
      //right
      if (
        P1X > platform.x &&
        P1X - halfSize < platform.x + platform.width / 2 &&
        !(P1Y < platform.y)
      ) {
        P1X = platform.x + platform.width / 2 + halfSize;
        console.log("-");
      }
    }
  }
}
//Enemy collider
function P2ColliderCheck() {
  P2Grounded = false;
  //ground collision
  if (Math.floor(P2Y) >= Math.floor(ground - halfSize)) {
    P2Grounded = true;
  }
  for (let platform of platforms) {
    //top platform collision (to stand on the platform)
    if (
      P2Y + halfSize >= platform.y &&
      P2Y + halfSize <= platform.y + platform.height &&
      P2X + halfSize - 1 >= platform.x - platform.width / 2 &&
      P2X - halfSize + 1 <= platform.x + platform.width / 2 &&
      !P2Jumping
    ) {
      P2Y = platform.y - halfSize;
      P2Grounded = true;
      return;
    }
    //bottom platform collision
    if (
      P2Y - halfSize <= platform.y + platform.height &&
      P2Y - halfSize >= platform.y &&
      P2X + halfSize - 1 >= platform.x - platform.width / 2 &&
      P2X - halfSize - 1 <= platform.x + platform.width / 2
    ) {
      P2Y = platform.y + platform.height + halfSize;
      P2Jumping = false;
    }
    //side platform collision
    if (
      P2X + halfSize >= platform.x - platform.width / 2 &&
      P2X - halfSize <= platform.x + platform.width / 2 &&
      P2Y + halfSize > platform.y &&
      P2Y - halfSize < platform.y + platform.height
    ) {
      //left
      if (
        P2X < platform.x &&
        P2X + halfSize > platform.x - platform.width / 2 &&
        !(P2Y < platform.y)
      ) {
        P2X = platform.x - platform.width / 2 - halfSize;
        console.log("+");
      }
      //right
      if (
        P2X > platform.x &&
        P2X - halfSize < platform.x + platform.width / 2 &&
        !(P2Y < platform.y)
      ) {
        P2X = platform.x + platform.width / 2 + halfSize;
        console.log("-");
      }
    }
  }
}

//Begin day and night cycle
function initializeDayNightCycle() {
  totalCycleDuration = dayDuration + nightDuration;
}

function updateDayNightCycle() {
  let secondsElapsed = frameCount / 60;
  cycleProgress = (secondsElapsed % totalCycleDuration) / totalCycleDuration;

  if (cycleProgress <= dayDuration / totalCycleDuration) {
    let dayProgress = cycleProgress / (dayDuration / totalCycleDuration);

    if (dayProgress <= 0.5) {
      bgColor = lerpColor(
        color(252, 212, 64),
        color(135, 206, 250),
        dayProgress * 2
      );
    } else {
      bgColor = lerpColor(
        color(135, 206, 250),
        color(250, 128, 114),
        (dayProgress - 0.5) * 2
      );
    }
  } else {
    let nightProgress =
      (cycleProgress - dayDuration / totalCycleDuration) /
      (nightDuration / totalCycleDuration);

    if (nightProgress <= 0.5) {
      bgColor = lerpColor(
        color(250, 128, 114),
        color(25, 25, 112),
        nightProgress * 2
      );
    } else {
      bgColor = lerpColor(
        color(25, 25, 112),
        color(252, 212, 255),
        (nightProgress - 0.5) * 2
      );
    }
  }
}

function applyAmbientLight() {
  let brightness;

  if (cycleProgress <= dayDuration / totalCycleDuration) {
    let dayProgress = cycleProgress / (dayDuration / totalCycleDuration);
    brightness = map(dayProgress, 0, 1, 255, 50);
  } else {
    let nightProgress =
      (cycleProgress - dayDuration / totalCycleDuration) /
      (nightDuration / totalCycleDuration);
    brightness = map(nightProgress, 0, 1, 50, 255);
  }

  fill(0, brightness);
  rect(0, 0, width, height);
}

function drawSunMoon() {
  let sunMoonX = map(cycleProgress, 0, 1, 0, width); // Moves from left to right based on cycleProgress
  let sunMoonY = height / 8;

  if (cycleProgress <= dayDuration / totalCycleDuration) {
    fill(255, 204, 0);
    ellipse(sunMoonX, sunMoonY, 80);
  } else {
    fill(255);
    ellipse(sunMoonX, sunMoonY, 50);
  }
}

function drawStars() {
  if (cycleProgress > dayDuration / totalCycleDuration) {
    let numStars = map(
      cycleProgress,
      dayDuration / totalCycleDuration,
      1,
      0,
      100
    ); // Gradually increase star count

    for (let i = 0; i < numStars; i++) {
      let x = random(width);
      let y = random(height / 4); // Limit star position to top of screen
      fill(255);
      noStroke();
      ellipse(x, y, random(2, 5));
    }
  }
}
//End day and night cycle

//Clouds
function createClouds() {
  for (let i = 0; i < 5; i++) {
    let cloudParts = [];
    let cloudSize = random(50, 100);
    let amount = random(3, 6);

    for (let j = 0; j < amount; j++) {
      let offsetX = random(-cloudSize / 2, cloudSize / 2);
      let offsetY = random(-cloudSize / 4, cloudSize / 4);
      let ellipseSize = cloudSize * random(0.8, 1.2);
      cloudParts.push({ offsetX, offsetY, ellipseSize });
    }

    clouds.push({
      x: random(width),
      y: random(height / 4),
      speed: random(0.5, 2),
      size: cloudSize,
      parts: cloudParts,
    });
  }
}

function drawClouds() {
  if (cycleProgress <= dayDuration / totalCycleDuration) {
    for (let cloud of clouds) {
      noStroke();
      fill(255, 255, 255, 200);

      for (let part of cloud.parts) {
        ellipse(
          cloud.x + part.offsetX,
          cloud.y + part.offsetY,
          part.ellipseSize,
          part.ellipseSize / 1.5
        );
      }

      cloud.x += cloud.speed;

      if (cloud.x > width) {
        cloud.x = -cloud.size;
      }
    }
  }
}

//Characters
//Allows for a bit of character customization
//Player 1
function createP1() {
  stroke("black");
  //head
  fill(getP1Health());
  ellipse(P1X + 15, P1Y - 15, 25);
  ellipse(P1X - 15, P1Y - 15, 25);
  ellipse(P1X, P1Y, size);
  ellipse(P1X, P1Y + 7, 20);
  //eyes
  fill(255);
  ellipse(P1X + 10, P1Y - 8, 10);
  ellipse(P1X - 10, P1Y - 8, 10);
  //iris
  fill(0, 0, 255);
  ellipse(P1X + 9, P1Y - 6, 5);
  ellipse(P1X - 9, P1Y - 6, 5);
  //snout
  fill(0);
  ellipse(P1X, P1Y + 1, 8);
  strokeWeight(2);
  line(P1X, P1Y + 8, P1X, P1Y + 5);
  angleMode(DEGREES);
  noFill();
  arc(P1X + 2.2, P1Y + 8, 5, 5, 0, 180, OPEN);
  arc(P1X - 2.2, P1Y + 8, 5, 5, 0, 180, OPEN);
  strokeWeight(1);
}
//Player 2
function createP2() {
  stroke("black");
  //head
  fill(getP2Health());
  ellipse(P2X + 15, P2Y - 15, 25);
  ellipse(P2X - 15, P2Y - 15, 25);
  ellipse(P2X, P2Y, size);
  ellipse(P2X, P2Y + 7, 20);
  //eyes
  fill(255);
  ellipse(P2X + 10, P2Y - 8, 10);
  ellipse(P2X - 10, P2Y - 8, 10);
  //iris
  fill(255, 0, 0);
  ellipse(P2X + 9, P2Y - 6, 5);
  ellipse(P2X - 9, P2Y - 6, 5);
  //snout
  fill(0);
  ellipse(P2X, P2Y + 1, 8);
  strokeWeight(2);
  line(P2X, P2Y + 8, P2X, P2Y + 5);
  angleMode(DEGREES);
  noFill();
  arc(P2X + 2.2, P2Y + 8, 5, 5, 0, 180, OPEN);
  arc(P2X - 2.2, P2Y + 8, 5, 5, 0, 180, OPEN);
  strokeWeight(1);
  noStroke();
}
//Sort of healthbar but simpler
//P1
function getP1Health() {
  if (P1Health === 3) {
    return color(0, 255, 0);
  } else if (P1Health === 2) {
    return color(255, 165, 0);
  } else if (P1Health === 1) {
    return color(255, 0, 0);
  }
}
//P2
function getP2Health() {
  if (P2Health === 3) {
    return color(0, 255, 0);
  } else if (P2Health === 2) {
    return color(255, 165, 0);
  } else if (P2Health === 1) {
    return color(255, 0, 0);
  }
}
//Trees
function createTreeLocations() {
  for (let i = 0; i < treeAmount; i++) {
    trees.push({
      x: random(0, canvasWidth),
      trunkHeight: random(100, 150),
      treeWidth: random(60, 100),
      treeHeight: random(80, 120),
    });
  }
}

function drawTrees() {
  for (let tree of trees) {
    fill(101, 67, 33);
    rect(
      tree.x,
      ground - tree.trunkHeight,
      tree.treeWidth / 4,
      tree.trunkHeight
    );

    fill(34, 139, 34);
    ellipse(
      tree.x + tree.treeWidth / 8,
      ground - tree.trunkHeight,
      tree.treeWidth,
      tree.treeHeight
    );
  }
}

//Sound
function soundSetup() {
  audioPlayer.speed(1);
  audioPlayer.volume(1);

  jumpSound.speed(1);
  jumpSound.volume(1);
  audioPlayer.play();
}
