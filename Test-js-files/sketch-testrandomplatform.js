p5.disableFriendlyErrors = true;

//Environmental variables
let audioPlayer;
let jumpSound;
let enemyDeathSound;
let attackSound;
let playerDeathSound; //Currently only a teaser
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
let grounded = false;
let y;
let x;
let size = 50;
let halfSize = size / 2;
//Player movement variables
let maxJumpHeight = 100;
let jumpCounter = 0;
let jumpCd = 0;
let jumping = false;
// Player attack variables
let attackCd = 0;
let isAttacking = false;
let attackPower = 1;
let hasHitEnemy = false;

//Enemy variables
let enemyGrounded = false;
let enemyY;
let enemyX;
let enemySize = 50;
let enemyHalfSize = enemySize / 2;
let direction = "right";
//Enemy health
let enemyHealth = 3;
let enemyAlive = true;
//Respawn enemy
let respawnTimer = 0;
let respawnTime = 180;

//Global movement
let fallSpeed = 4;
let moveSpeed = 2;

//Time variables
let frame = 0;
let second = 0;
let minute = 0;
let hour = 0;
let day = 0;

//Tree variables
let trees = [];
let treeAmount = 10;

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
  x = (windowWidth - 50) / 2;
  y = (windowHeight - 50) * 0.9;

  enemyX = random(50, canvasWidth - 50);
  enemyY = (windowHeight - 50) * 0.9;

  initializeDayNightCycle();
  createClouds();
  createTreeLocations();
  generatePlatforms(5);

  frameRate(60);
}

function draw() {
  applyAmbientLight();
  updateDayNightCycle();
  document.body.style.backgroundColor = bgColor;
  background(bgColor);

  checkAttackOnEnemy();
  createPlatforms();
  drawTrees();
  movement();
  enemyMovement();
  gravity();
  colliderCheck();
  enemyColliderCheck();
  drawStars();
  drawSunMoon();
  createCharacter();
  drawClouds();
  if (enemyAlive) {
    createEnemy();
  } else if (!enemyAlive) {
    respawnEnemy();
  }
}

function windowResized() {
  canvasHeight = windowHeight - 50;
  canvasWidth = windowWidth - 50;
  resizeCanvas(canvasWidth, ground);
  x = (windowHeight - 50) / 2;
  y = ground - halfSize;
  createPlatforms();
}

function gravity() {
  if (grounded == false) {
    y += fallSpeed;
  }
  if (enemyGrounded == false) {
    enemyY += fallSpeed;
  }
}

//Movement
//Player movement
function movement() {
  //Left (A or Left arrow)
  if ((keyIsDown(65) || keyIsDown(37)) && x > 0 + halfSize) {
    x -= moveSpeed;
  }
  //Right (D or Right arrow)
  if ((keyIsDown(68) || keyIsDown(39)) && x < canvasWidth - halfSize) {
    x += moveSpeed;
  }
  //Jump (W or Up arrow)
  if ((keyIsDown(87) || keyIsDown(38)) && grounded && jumpCd === 0) {
    jumpSound.play();
    jumping = true;
    jumpCd = 20;
    jumpCounter = maxJumpHeight;
    grounded = false;
  }
  if (jumping) {
    let jumpSpeed = map(jumpCounter, 0, maxJumpHeight, 1, 10);
    y -= jumpSpeed;
    jumpCounter--;

    if (jumpCounter <= 0) {
      jumping = false;
    }
  }

  //Jump cooldown
  if (jumpCd > 0 && grounded == true) {
    jumpCd--;
  }

  //Attack (Space)
  if (keyIsDown(32) && attackCd === 0) {
    isAttacking = true;
    attackCd = 120;
  }

  //Attack cooldown (prevents instakilling the enemy (Oops))
  if (attackCd > 0) {
    attackCd--;
    if (attackCd === 0) {
      isAttacking = false;
      hasHitEnemy = false;
    }
  }
}
//Enemy movement
function enemyMovement() {
  if (!enemyAlive) return;
  //Left
  if (direction === "left") {
    if (enemyX > 0 + enemyHalfSize) {
      enemyX -= moveSpeed;
    } else if (enemyX <= 0 + enemyHalfSize) {
      direction = "right";
    }
  }
  //Right
  else if (direction === "right") {
    if (enemyX < canvasWidth - enemyHalfSize) {
      enemyX += moveSpeed;
    } else if (enemyX >= canvasWidth - enemyHalfSize) {
      direction = "left";
    }
  }
  //Jump (might be added later)
}

//Attack
function checkAttackOnEnemy() {
  if (isAttacking && enemyAlive && !hasHitEnemy) {
    let distanceX = Math.abs(x - enemyX);
    let distanceY = Math.abs(y - enemyY);

    if (
      distanceX < halfSize + enemyHalfSize &&
      distanceY < halfSize + enemyHalfSize
    ) {
      attackSound.play();
      enemyHealth -= attackPower;
      hasHitEnemy = true;
      console.log(`Enemy Health: ${enemyHealth}`);

      if (enemyHealth <= 0) {
        enemyDeathSound.play();
        enemyAlive = false;
        console.log("Enemy is dead!");
      }
    }
  }
}

//Respawn enemy
function respawnEnemy() {
  if (!enemyAlive) {
    respawnTimer++;
    if (respawnTimer >= respawnTime) {
      enemyHealth = 3;
      enemyX = random(50, canvasWidth - 50);
      console.log("Enemy respawned at X:", enemyX, "Y:", enemyY);
      enemyY = ground - enemyHalfSize;
      enemyAlive = true;
      respawnTimer = 0;
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
function generatePlatforms(PlatformAmount) {
  platforms = [];

  let minPlatformWidth = 100;
  let maxPlatformWidth = 200;
  let minVerticalSpacing = 50;
  let maxHorizontalSpacing = 300;
  let playerJumpHeight = 150;

  let platformX = random(
    minPlatformWidth / 2,
    canvasWidth - minPlatformWidth / 2
  );
  let platformY = canvasHeight - 50;

  for (let i = 0; i < PlatformAmount; i++) {
    let platformWidth = random(minPlatformWidth, maxPlatformWidth);

    let newPlatformX =
      platformX + random(-maxHorizontalSpacing, maxHorizontalSpacing);

    newPlatformX = constrain(
      newPlatformX,
      platformWidth / 2,
      canvasWidth - platformWidth / 2
    );

    let newPlatformY = platformY - random(minVerticalSpacing, playerJumpHeight);

    newPlatformY = constrain(newPlatformY, 0, canvasHeight - 50);

    platforms.push({
      x: newPlatformX,
      y: newPlatformY,
      width: platformWidth,
      height: 20,
    });

    platformX = newPlatformX;
    platformY = newPlatformY;
  }
}

//Colliders
//Player colliders
function colliderCheck() {
  grounded = false;
  //ground collision
  if (Math.floor(y) >= Math.floor(ground - halfSize)) {
    grounded = true;
  }
  for (let platform of platforms) {
    //top platform collision (to stand on the platform)
    if (
      y + halfSize >= platform.y &&
      y + halfSize <= platform.y + platform.height &&
      x + halfSize - 1 >= platform.x - platform.width / 2 &&
      x - halfSize + 1 <= platform.x + platform.width / 2 &&
      !jumping
    ) {
      y = platform.y - halfSize;
      grounded = true;
      return;
    }
    //bottom platform collision
    if (
      y - halfSize <= platform.y + platform.height &&
      y - halfSize >= platform.y &&
      x + halfSize - 1 >= platform.x - platform.width / 2 &&
      x - halfSize - 1 <= platform.x + platform.width / 2
    ) {
      y = platform.y + platform.height + halfSize;
      jumping = false;
    }
    //side platform collision
    if (
      x + halfSize >= platform.x - platform.width / 2 &&
      x - halfSize <= platform.x + platform.width / 2 &&
      y + halfSize > platform.y &&
      y - halfSize < platform.y + platform.height
    ) {
      //left
      if (
        x < platform.x &&
        x + halfSize > platform.x - platform.width / 2 &&
        !(y < platform.y)
      ) {
        x = platform.x - platform.width / 2 - halfSize;
        console.log("+");
      }
      //right
      if (
        x > platform.x &&
        x - halfSize < platform.x + platform.width / 2 &&
        !(y < platform.y)
      ) {
        x = platform.x + platform.width / 2 + halfSize;
        console.log("-");
      }
    }
  }
}
//Enemy collider
function enemyColliderCheck() {
  enemyGrounded = false;
  //ground collision
  if (Math.floor(enemyY) >= Math.floor(ground - enemyHalfSize)) {
    enemyGrounded = true;
  }
  for (let platform of platforms) {
    //top platform collision (to stand on the platform)
    if (
      enemyY + enemyHalfSize >= platform.y &&
      enemyY + enemyHalfSize <= platform.y + platform.height &&
      enemyX + enemyHalfSize - 1 >= platform.x - platform.width / 2 &&
      enemyX - enemyHalfSize + 1 <= platform.x + platform.width / 2 &&
      !jumping
    ) {
      enemyY = platform.y - enemyHalfSize;
      enemyGrounded = true;
      return;
    }
    //bottom platform collision
    if (
      enemyY - enemyHalfSize <= platform.y + platform.height &&
      enemyY - enemyHalfSize >= platform.y &&
      enemyX + enemyHalfSize - 1 >= platform.x - platform.width / 2 &&
      enemyX - enemyHalfSize - 1 <= platform.x + platform.width / 2
    ) {
      enemyY = platform.y + platform.height + enemyHalfSize;
      //Commented in case I wanna add random jumps to the enemy
      //jumping = false;
    }
    //side platform collision
    if (
      enemyX + enemyHalfSize >= platform.x - platform.width / 2 &&
      enemyX - enemyHalfSize <= platform.x + platform.width / 2 &&
      enemyY + enemyHalfSize > platform.y &&
      enemyY - enemyHalfSize < platform.y + platform.height
    ) {
      //left
      if (
        enemyX < platform.x &&
        enemyX + enemyHalfSize > platform.x - platform.width / 2 &&
        !(enemyY < platform.y)
      ) {
        enemyX = platform.x - platform.width / 2 - enemyHalfSize;
        console.log("+");
      }
      //right
      if (
        enemyX > platform.x &&
        enemyX - enemyHalfSize < platform.x + platform.width / 2 &&
        !(enemyY < platform.y)
      ) {
        enemyX = platform.x + platform.width / 2 + enemyHalfSize;
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
function createCharacter() {
  stroke("black");
  //head
  fill(115, 64, 28);
  ellipse(x + 15, y - 15, 25);
  ellipse(x - 15, y - 15, 25);
  ellipse(x, y, size);
  ellipse(x, y + 7, 20);
  //eyes
  fill(255);
  ellipse(x + 10, y - 8, 10);
  ellipse(x - 10, y - 8, 10);
  //iris
  fill(0);
  ellipse(x + 9, y - 6, 5);
  ellipse(x - 9, y - 6, 5);
  //snout
  fill(0);
  ellipse(x, y + 1, 8);
  strokeWeight(2);
  line(x, y + 8, x, y + 5);
  angleMode(DEGREES);
  noFill();
  arc(x + 2.2, y + 8, 5, 5, 0, 180, OPEN);
  arc(x - 2.2, y + 8, 5, 5, 0, 180, OPEN);
  strokeWeight(1);
}
//Enemy AI
function createEnemy() {
  stroke("black");
  //head
  fill(getEnemyHealth());
  ellipse(enemyX + 15, enemyY - 15, 25);
  ellipse(enemyX - 15, enemyY - 15, 25);
  ellipse(enemyX, enemyY, enemySize);
  ellipse(enemyX, enemyY + 7, 20);
  //eyes
  fill(255);
  ellipse(enemyX + 10, enemyY - 8, 10);
  ellipse(enemyX - 10, enemyY - 8, 10);
  //iris
  fill(0);
  ellipse(enemyX + 9, enemyY - 6, 5);
  ellipse(enemyX - 9, enemyY - 6, 5);
  //snout
  fill(0);
  ellipse(enemyX, enemyY + 1, 8);
  strokeWeight(2);
  line(enemyX, enemyY + 8, enemyX, enemyY + 5);
  angleMode(DEGREES);
  noFill();
  arc(enemyX + 2.2, enemyY + 8, 5, 5, 0, 180, OPEN);
  arc(enemyX - 2.2, enemyY + 8, 5, 5, 0, 180, OPEN);
  strokeWeight(1);
  noStroke();
}
//Sort of healthbar but simpler
function getEnemyHealth() {
  if (enemyHealth === 3) {
    return color(0, 255, 0);
  } else if (enemyHealth === 2) {
    return color(255, 165, 0);
  } else if (enemyHealth === 1) {
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
