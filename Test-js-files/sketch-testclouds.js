//Test to add clouds for more environment
p5.disableFriendlyErrors = true;

//Environmental variables
let audioPlayer;
let jumpSound;
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

//"Character" variables
let grounded = false;
let y;
let x;
let size = 50;
let halfSize = size / 2;

//Movement variables
let maxJumpHeight = 100;
let jumpCounter = 0;
let jumpCd = 0;
let jumping = false;
let fallSpeed = 4;
let moveSpeed = 2;

//Time variables
let frame = 0;
let second = 0;
let minute = 0;
let hour = 0;
let day = 0;

//Other variables
let name;

//Functions
function preload() {
  audioPlayer = createAudio("./audio/Coffee.mp3");
  jumpSound = createAudio("./audio/jump-sfx.mp3");
}

function setup() {
  canvasHeight = windowHeight - 50;
  ground = canvasHeight;
  canvasWidth = windowWidth - 50;
  createCanvas(canvasWidth, canvasHeight);
  SoundSetup();
  x = (windowHeight - 50) / 2;
  y = (windowHeight - 50) * 0.9;

  initializeDayNightCycle();
  createClouds();

  frameRate(60);

  //Platform setup
  /*{ x: canvasWidth, y: canvasHeight, width: 150, height: 20 },*/

  platforms = [
    { x: canvasWidth / 6, y: canvasHeight / 1.9, width: 150, height: 20 },
    { x: canvasWidth / 2.4, y: canvasHeight / 1.7, width: 200, height: 20 },
    { x: canvasWidth / 1.7, y: canvasHeight / 2.9, width: 150, height: 20 },
    { x: canvasWidth / 1.5, y: canvasHeight / 1.3, width: 200, height: 20 },
  ];
}

function draw() {
  applyAmbientLight();
  updateDayNightCycle();
  document.body.style.backgroundColor = bgColor;
  background(bgColor);

  createPlatforms();
  movement();
  gravity();
  colliderCheck();
  drawStars();
  drawSunMoon();
  createCharacter();
  drawClouds();
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
}

function movement() {
  //Left
  if ((keyIsDown(65) || keyIsDown(37)) && x > 0 + halfSize) {
    x -= moveSpeed;
  }
  //Right
  if ((keyIsDown(68) || keyIsDown(39)) && x < canvasWidth - halfSize) {
    x += moveSpeed;
  }
  //Jump
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

function createClouds() {
  for (let i = 0; i < 5; i++) {
    let cloudParts = [];
    let cloudSize = random(50, 100);
    let amount = random(3, 6);

    // Create each cloud's structure only once
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

// Draw clouds with fixed structure while moving
function drawClouds() {
  if (cycleProgress <= dayDuration / totalCycleDuration) {
    for (let cloud of clouds) {
      noStroke();
      fill(255, 255, 255, 200);

      // Use pre-defined parts for consistent cloud shape
      for (let part of cloud.parts) {
        ellipse(
          cloud.x + part.offsetX,
          cloud.y + part.offsetY,
          part.ellipseSize,
          part.ellipseSize / 1.5
        );
      }

      // Move the cloud
      cloud.x += cloud.speed;

      // Reset cloud position when it goes off screen
      if (cloud.x > width) {
        cloud.x = -cloud.size;
      }
    }
  }
}

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
//Sound
function SoundSetup() {
  audioPlayer.speed(1);
  audioPlayer.volume(1);

  jumpSound.speed(1);
  jumpSound.volume(1);
  audioPlayer.play();
}
