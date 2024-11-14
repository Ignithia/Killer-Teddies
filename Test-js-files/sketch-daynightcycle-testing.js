//Test to simulate day-night cycle
// Status: Partially successful
// Reason: The code is working as expected, but the colors are not transitioning smoothly and the sun changes into the moon abruptly.

let dayDuration = 60;
let nightDuration = 120;

let totalCycleDuration;
let cycleProgress = 0;

let bgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);

  totalCycleDuration = dayDuration + nightDuration;
  frameRate(60);
}

function draw() {
  updateDayNightCycle();
  background(bgColor);

  fill(0);
  textSize(20);
  text(`Cycle Progress: ${(cycleProgress * 100).toFixed(2)}%`, 20, 40);
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
