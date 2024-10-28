let dayDuration = 60.6; // Day lasts for 60.6 seconds
let nightDuration = 59.4; // Night lasts for 59.4 seconds
let totalCycleDuration;
let cycleProgress = 0;
let bgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize the day-night cycle
  initializeDayNightCycle();
  frameRate(60); // Keep the frame rate at 60 fps
}

function draw() {
  // Update and draw the day-night cycle
  updateDayNightCycle();
  background(bgColor); // Apply the current background color

  // Apply ambient light effect
  applyAmbientLight();
}

// Initialize day-night cycle parameters
function initializeDayNightCycle() {
  totalCycleDuration = dayDuration + nightDuration;
}

// Update background color based on time
function updateDayNightCycle() {
  let secondsElapsed = frameCount / 60; // Convert frameCount to seconds
  cycleProgress = (secondsElapsed % totalCycleDuration) / totalCycleDuration;

  // Full day-night cycle (0 to 1 progress)
  if (cycleProgress <= dayDuration / totalCycleDuration) {
    let dayProgress = cycleProgress / (dayDuration / totalCycleDuration);

    // Daytime transitions: morning (yellow) → noon (blue) → sunset (orange)
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

    // Nighttime transitions: sunset (orange) → night (dark blue) → dawn (pink)
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

// Apply ambient light effect
function applyAmbientLight() {
  let brightness;

  if (cycleProgress <= dayDuration / totalCycleDuration) {
    let dayProgress = cycleProgress / (dayDuration / totalCycleDuration);
    brightness = map(dayProgress, 0, 1, 255, 0); // Dim the brightness during the day
  } else {
    let nightProgress =
      (cycleProgress - dayDuration / totalCycleDuration) /
      (nightDuration / totalCycleDuration);
    brightness = map(nightProgress, 0, 1, 0, 255); // Brighten the screen at night
  }

  fill(0, brightness); // Create a semi-transparent overlay
  rect(0, 0, width, height); // Draw the overlay over the entire canvas
}
