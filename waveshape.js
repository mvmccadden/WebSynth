/*!
 *  \author Manoel McCadden
 *  \date   06-23-25
 *  \file   waveshape.js
 *  \par
 *    The main file that handles combining all the wave components together
 */

//=====================//
//= Wave Shape Consts =//
//=====================//

// Set the color for selecting objects
const SELECT_COLOR = {
  r: 255, g: 110, b: 0
}
// Set the color for playing objects
const PLAYING_COLOR = {
  r: 10, g: 230, b: 20
}

// Shape colors
const SINE_COLOR = {
  r: 22, g: 133, b: 248, a: 255
}
const TRIANGLE_COLOR = {
  r: 233, g: 0, b: 255, a: 255
}
const SAWTOOTH_COLOR = {
  r: 245, g: 39, b: 137, a: 255
}
const SQUARE_COLOR = {
  r: 250, g: 235, b: 44, a: 255
}
// Color for non-selected objects (BLACK)
const COLOR_BLACK = 0;

// Used for adjusting weight for selected objects
const SELECT_STROKE_WEIGHT = 3;
const UNSELECT_STROKE_WEIGHT = 2;
const DEFAULT_STROKE_WEIGHT = 1;

// Used to set the min and max freq and amp avaliable
const MAX_FREQ = 11000;
const MIN_FREQ = 15;
const MAX_LOG_FREQ = Math.log(MAX_FREQ);
const MIN_LOG_FREQ = Math.log(MIN_FREQ);
const MAX_AMP = 1;
const MIN_AMP = 0;

//========================//
//= Wave Shape Variables =//
//========================//

// Container for waves
let waves = [];
let selectedWave = 'undefined';

//======================//
//= Wave Shape Classes =//
//======================//

/*!
 *  Constructs a new base wave shape that can be drawn a played
 */
class WaveShape {
  static waveID = 0;

  static IncrementWaveID() {
    return WaveShape.waveID++;
  }

  constructor([x,y], size, waveType) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.shape = new Shape([0,0], 0, [0,0,0,0]);
    this.collider = new Collider(this.shape);

    this.osc = new Osc(waveType);
  
    // A toggle flag used to turn on and off sustain
    this.sustain = false;

    // A selection variable used to connect objects to the mouse movement
    // in order to move them around the plane
    this.selected = false;

    this.latestNote = MIDI_NOTES[0];
    this.octave = Math.round(x / (windowSize.x / TOTAL_OCTAVES) - MAX_OCTAVE);

    this.id = WaveShape.IncrementWaveID();
  }

  get Playing() {
    return this.osc.Playing;
  }

  get Pos() {
    return [this.x, this.y];
  }

  get Size() {
    return this.size;
  }

  get Selected() {
    return this.selected;
  }

  get Sustain() {
    return this.sustain;
  }

  get Freq() {
    return this.osc.Freq;
  }

  get Amp() {
    return this.osc.Amp;
  }

  get LatestNote() {
    return this.latestNote;
  }

  get Octave() {
    return this.octave;
  }

  get ID() {
    return this.id;
  }

  ToggleSustain() {
    this.sustain = !this.sustain;
  }

  Play() {
    this.osc.Play();
  }

  Stop() {
    this.osc.Stop();
  }

  SetPos([x,y]) {
    this.x = x;
    this.y = y;
  }

  SetSize(size) {
    this.size = size;
  }

  SetLastestNote(note) {
    this.latestNote = note;
  }

  SetOctave(octave) {
    this.octave = octave;
  }

  Select() {
    // Set this to the selected wave and unselected wave if one is selected
    if(selectedWave != 'undefined') {
      selectedWave.Unselect();
    }
    selectedWave = this;
    this.selected = true;
    // Add the last playing note to the playing list to ensure it stays 
    // playing if sustain is active
    if(this.sustain == true) {
      playingNotes.push(this.latestNote);
    }
  }

  Unselect() {
    selectedWave = 'undefined';
    this.selected = false;
    if(this.sustain == false) {
      this.Stop();
    }
  }

  /*!
   *  Simply draws the wave using its visual shape while not updating/checking
   *  for collisions or osc adjustments
   */
  Draw() {
    // If this shape is currently selected then add an orange highlight
    if(this.selected == true) {
      strokeWeight(SELECT_STROKE_WEIGHT);
      stroke(SELECT_COLOR.r, SELECT_COLOR.g, SELECT_COLOR.b);
      this.shape.Draw();
      strokeWeight(DEFAULT_STROKE_WEIGHT);
      stroke(COLOR_BLACK);
    }
    else if(this.osc.Playing == true) {
      let [r,g,b,a] = this.shape.Color;
      stroke(PLAYING_COLOR.r, PLAYING_COLOR.g, PLAYING_COLOR.b);
      strokeWeight(UNSELECT_STROKE_WEIGHT);
      this.shape.Draw();
      strokeWeight(DEFAULT_STROKE_WEIGHT);
      stroke(COLOR_BLACK);
    }
    else {
      this.shape.Draw();
    }
  }

  // TODO: Update so that during midi mode it doesn't play the note on click
  CollisionCheck() {
    // Update the collider and check if playing status needs to change
    this.collider.Update();

    if(this.collider.Collision == true) {
      this.Select();
    }
    // If not colliding then make sure that selection is disabled
    else if(this.selected == true) {
      this.Unselect();
    }
  }

  Update() {
    // Update shape position and size as needed
    this.shape.SetPos([this.x, this.y]);
    this.shape.SetSize(this.size);

    // Get the positions shape and convert to a freq and amp for the osc
    const [x,y] = this.shape.Pos
    // We use the log freqeucnies to move it to the correct location on 
    // screen relative to a logrithmic scale and then exponent it
    this.osc.SetFreq(Math.exp(constrain(map(x, 0, windowSize.x, MIN_LOG_FREQ
      , MAX_LOG_FREQ), MIN_LOG_FREQ, MAX_LOG_FREQ), 0.1));
    this.osc.SetAmp(constrain(map(y, windowSize.y, 0, MIN_AMP, MAX_AMP)
      , MIN_AMP, MAX_AMP), 0.1);
  }
}

/*!
 *  Extends the wave shape class with saw, sine, square, and triangle waves
 */
class SineWave extends WaveShape {
  constructor([x,y], size) {
    // Call the original ctor
    super([x,y], size, 'sine');

    this.shape = new Circle([x,y], size
      , [SINE_COLOR.r, SINE_COLOR.g, SINE_COLOR.b, SINE_COLOR.a]);
    this.collider = new CircleCollider(this.shape);
  }
}

class SquareWave extends WaveShape {
  constructor([x,y], size) {
    // Call the original ctor
    super([x,y], size, 'square');

    this.shape = new Square([x,y], size, [SQUARE_COLOR.r, SQUARE_COLOR.g
      , SQUARE_COLOR.b, SQUARE_COLOR.a]);
    this.collider = new SquareCollider(this.shape);
  }
}

class TriangleWave extends WaveShape {
  constructor([x,y], size) {
    // Call the orginal ctor
    super([x,y], size, 'triangle');

    this.shape = new Triangle([x,y], size, [TRIANGLE_COLOR.r, TRIANGLE_COLOR.g
      , TRIANGLE_COLOR.b, TRIANGLE_COLOR.a]);
    // TODO: Update to triangle collision
    this.collider = new SquareCollider(this.shape);
  }
}

class SawtoothWave extends WaveShape {
  constructor([x,y], size) {
    // Call the orginal ctor
    super([x,y], size, 'sawtooth');

    this.shape = new Sawtooth([x,y], size, [SAWTOOTH_COLOR.r, SAWTOOTH_COLOR.g
      , SAWTOOTH_COLOR.b, SAWTOOTH_COLOR.a]);
    // TODO: Update to triangle collision
    this.collider = new SquareCollider(this.shape);
  }
}
