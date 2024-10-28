p5.disableFriendlyErrors = true;
//environmental variables
let audioPlayer;

//frame variables
let ground;
let canvaswidth;

//platform variables
let platformtop;
let platformY;
let platformX;

//"character" variables
let grounded = false;
let y;
let x;
let size = 50;
let halfsize = size / 2;
//movement variables
let jump = false;
let jumpcd = 0;
let jumping = false;
let cdcounter = 0;
//time variables
let frame = 0;
let second = 0;
let minute = 0;
let hour = 0;
let day = 0;

function setup() {
  ground = windowHeight - 50;
  canvaswidth = windowWidth - 50;
  createCanvas(canvaswidth, ground);

  x = (windowHeight - 50) / 2;
  y = (windowHeight - 50) * 0.9;

  platformX = (windowHeight - 50) / 2;
  platformY = (windowHeight - 50) * 0.9;
  frameRate(60);

  audioPlayer = createAudio("./audio/Coffee.mp3");
  audioPlayer.speed(1);
  //audioPlayer.play();
  audioPlayer.volume(1);
  document.body.style.backgroundColor = "rgb(220,220,220)";
}

function draw() {
  background(220);
  ellipse(x, y, size);
  createPlatformOne();
  movement();
  gravity();
  checkgrounded();
  colliderCheck();
}

function windowResized() {
  ground = windowHeight - 50;
  canvaswidth = windowWidth - 50;
  resizeCanvas(canvaswidth, ground);
}

function gravity() {
  if (
    y >= platformtop &&
    x >= platformX + platformX / 2 &&
    x <= platformX - platformX / 2
  ) {
    y++;
  } else if (y <= ground - size / 2 && jump == false) {
    y++;
  }
}
function movement() {
  //left
  if (keyIsDown(65) && x > 0 + halfsize) {
    x--;
  }
  //right
  if (keyIsDown(68) && x < canvaswidth - halfsize) {
    x++;
  }
  //jump
  if (keyIsDown(87)) {
    jump = true;
    let maxjumph = 100;
    let lowesty = ground - size;
    const jumph = y - maxjumph;
    let i2 = 0;

    if (jump == true && y != jumph && grounded == true) {
      jumping = true;
      jumpcd = 5;
      for (let i = 0; i <= maxjumph; i++) {
        y--;
        i2++;
      }
      if (i2 >= maxjumph) {
        jumping = false;
        i2 = 0;
      }
    }
    if (jump == true && y != lowesty && jumping != true) {
      jump = false;
    }
  }
}
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

function cooldowns() {
  //jumpcooldown
  cdcounter++;
  if (cdcounter >= 60) {
    jumpcd--;
    cdcounter = 0;
  }
}
function checkgrounded() {
  if (Math.floor(y) == Math.floor(ground - halfsize)) {
    grounded = true;
  } else {
    grounded = false;
  }
}

function createPlatformOne() {
  rect(platformX, platformY, 300, 20);
  platformtop = platformY + 10;
}
function colliderCheck() {
  if (
    y >= platformtop &&
    x >= platformX + platformX / 2 &&
    x <= platformX - platformX / 2
  ) {
    console.log("Collided");
  }
}
