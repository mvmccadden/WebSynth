/*!
 *  \author Manoel McCadden
 *  \date   06-23-25
 *  \file   sketch.js
 *  \par
 *    The main point of entrance for the p5 web app
 */

// TODO: NEXT STEPS
// 1. Creating a class that holds an osc and a shape and changes freq and amp
//  based on the shapes position x,y (each shape different color)
// 2. Creating a grid that displays freq and amp spectrum in a graph format
// 3. Creating a GUI that allows users to select a shape and place it
//  onto the graph
// 4. Adding the ability to add filters and modulation to osc/shapes
// 5. Adding antoher GUI to handle filters and modulation
// 6. Creating a feature allowing the user to record and save their creations
// 7. ALlowing exporting of creations
// 8. Allowing for work to be saved in a single readable file
// 9. Allowing for importing previously mentioned file for easy 
//  continuation of works with GUI for export/import
// 10. Allowing for the user of MIDI controlls or at least keyboard control
// 11. Allowing for different audio files to be uploaded and used kinda like 
//  a makeshift web-based DAW/Sequencer/Drum Machine/Synth Mix

// TODO: Extra nice things to add
// 1. Add a way to ensure that shapes are only updated either when the mosue 
//  is pressed or if they are currently selected by having a special selected
//  entity variable that holds the selected entity updating it every frame


//  TODO: ADJUSTMENTS
//  1. Need to adjust scaling of screen to freq ratio so that it is more 
//    logrithmic so that it mimics music better and isn't forcing a majority
//    of notes below like X6 down to the bottom 1/7th of the screen

// TODO: Add octave indicator on screen

// Sketch variables
const BACKGROUND_COLOR = {
  r: 30, g: 6, b: 36
}

// Mode types
// NOTE: Look into changing this to be an array of mode classes
const MODES = [
  {
    text: "MODE: Osc", 
    value: 0, 
    init: 'undefined',
    update: 'undefined',
    // TODO: In osc exit set so that it clears display text
    exit: 'undefined'
  },
  {
    text: "MODE: Midi", 
    value: 1,
    init: MidiInit,
    update: MidiUpdate,
    exit: MidiExit
  }
]

// Handles displaying command text
let displayText;
// Handles displaying mode text
let activeMode = 0;
let modeText;
// Extra info text (3rd line)
let extraInfoText;

// Handles tracking the window size
let windowSize = {
  x: 0, y: 0
}

function setup() {
  windowSize.x = windowWidth - windowWidth / 75;
  windowSize.y = windowHeight - windowHeight / 50;
  createCanvas(windowSize.x, windowSize.y);

  // Create a text obj to commands and another for modes
  displayText = new Text([10, 60], [255,255,255,255], "", 20, 0, true, false);
  modeText = new Text([10, 30], [255,255,255,255], MODES[activeMode].text
    , 20, 0, false, false);
  extraInfoText = new Text([10, 90], [255,255,255,255], "", 20, 0, true, false);
}

function draw() {
  // Clear the background
  background(BACKGROUND_COLOR.r, BACKGROUND_COLOR.g, BACKGROUND_COLOR.b);

  // Do the update function that proper to the mode that is active
  if(MODES[activeMode].update != 'undefined') {
    MODES[activeMode].update();
  }

  // Update the selected object if it exists until it is no longer selected
  if(selectedWave != 'undefined') {
    // Set the obj back to undefined if it is unselected
    // As we are updating it seperate of all over objects we must
    // do adjustments here as it will not happen in the loop
    // NOTE: we do the selection check before the update as the mouse press
    // seems to update before the draw is called 
    if(selectedWave.Selected == false) {
      selectedWave = 'undefined';
    }
    else {
      selectedWave.Update();
    }

  }

  // For all other waves we will simply draw them as we do not want to allow
  // for collisions or osc modifications while another wave is selected
  for(const wave of waves) {
    wave.Draw();
  }

  // Print command display text if there is anything relavent to display
  displayText.Print();
  modeText.Print();
  extraInfoText.Print();
}

function mousePressed() {
  // Avoid starting audio till user input is given to allign with browser
  // policy standards
  userStartAudio();
  // Checking all waves on any mouse input to see if any are 
  // being collided with
  for(const wave of waves) {
    wave.CollisionCheck();
    // Check all waves for selection so that they can be properly updated
    // NOTE: will prioritize the last wave added if multiple are overlaying
    // one another but this should be ok as that means that it will be 
    // overylaying visually as well so should be intuative and make sense
    // to the user
    if(wave.Selected == true) {
      // Make sure to set the selected status of the currently selected wave
      // to unselected if there is currently one selected
      if(selectedWave != 'undefined') {
        selectedWave.Unselect();
      }
      selectedWave = wave;
    }

  }
}
