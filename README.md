# Interactive p5.js Environment

This project is an interactive environment built using p5.js. It features a day-night cycle, moving clouds, platforms, and a character that can move and jump. The environment also includes background music and sound effects.

## Project Structure (and possible notes)

The project is organized into the following directories and files:

- **Actual-Versions/**
  - `sketch-v1.js`
  - `sketch-v2.js`
  - `sketch-v3.js`
  - `sketch-v4.js`
  - `sketch-v5.js` (This version is not yet fully completed, code still has to be cleaned up and tested for bugs)
- **audio/**
- **read.txt**
- **index.html**
- **style.css**
- **README.md**
- **LICENSE.txt**
- **Test-js-files/**
  - `sketch-ambientlight.js`
  - `sketch-daynightcycle-testing.js`
  - `sketch-testattacking.js`
  - `sketch-testclouds.js`
  - `sketch-testrandomplatform.js`
  - `sketch-testpowerups.js`
- **To-Do.txt**

### Directory and File Descriptions

- **Actual-Versions/**: Contains different versions of the main sketch file.

  - `sketch-v1.js`: Initial version of the sketch.
  - `sketch-v2.js`: Second version with improvements.
  - `sketch-v3.js`: Latest version with additional features.
  - `sketch-v4.js`: Adds multiplayer instead of AI.
  - `sketch-v5.js`: Adds power-ups (will also be cleaner up in the next commit)

- **audio/**: Directory for audio files used in the project.

  - `read.txt`: Placeholder file for audio directory.

- **index.html**: The main HTML file to run the p5.js sketch.

- **style.css**: CSS file for styling the HTML page.

- **README.md**: This file, containing the project documentation.

- **LICENSE.txt**: The file containing the project's license information.

- **Test-js-files/**: Contains various test sketches for different features.

  - `sketch-ambientlight.js`: Test sketch for ambient light effects.
  - `sketch-daynightcycle-testing.js`: Test sketch for the day-night cycle.
  - `sketch-testattacking.js`: Test sketch for character attacking mechanics.
  - `sketch-testclouds.js`: Test sketch for cloud generation and movement.
  - `sketch-testrandomplatform.js`: Test sketch for random platform generation.
  -  `sketch-powerups.js`: Test sketch for power-ups and their behaviour in a multiplayer game environment

- **To-Do.txt**: A text file listing tasks and features to be implemented.

## How to Run

1. Clone the repository to your local machine.
2. Open `index.html` in a web browser to run the p5.js sketch.

## Features

- **Day-Night Cycle**: The environment transitions between day and night over a set duration.
- **Moving Clouds**: Clouds move across the sky with a fixed structure.
- **Platforms**: Platforms are generated for the character to jump on.
- **Character Movement**: The character can move left, right, and jump.
- **Sound Effects**: Background music and jump sound effects are included.

## Usage

Version 1.0 - 3.0

- Use the arrow keys or WASD keys to move the character.
- The character can jump when grounded by pressing the up arrow or 'W' key.
- Attack is space

Version 4.0+

Player 1 (Blue):
- Use A or D to move left or right
- Use W to jump
- Use space to attack
  
Player 2:
- Use Left arrow or Right arrow to move left or right
- Use Up arrow to jump
- Use Right CTRL to attack

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
