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

  Select() {
    this.selected = true;
    // Set this to the selected wave and unselected wave if one is selected
    if(selectedWave != 'undefined') {
      selectedWave.Unselect();
    }
    selectedWave = this;
  }

  Unselect() {
    this.selected = false;
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
      // If user is pressing LEFT-CTL(17) when they collide then we enable 
      // selection without adjusting playback to allow for a silent play
      if(keyIsDown(17) == true) {
        this.selected = true;
      }
      else if(this.osc.Playing == true) {
        this.osc.Stop();
      }
      // If user is currently selecting this object and has collided with it 
      // then we are placing it and must stop moving it therefore we must
      // disable selection
      else if(this.selected == true) {
        this.selected == false;
      }
      else {
        this.selected = true;
        this.osc.Play();
      }
    }
    // If not colliding then make sure that selection is disabled
    else {
      this.selected = false;
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

    this.shape = new Circle([x,y], size, [22, 133, 248, 255]);
    this.collider = new CircleCollider(this.shape);
  }
}

class SquareWave extends WaveShape {
  constructor([x,y], size) {
    // Call the original ctor
    super([x,y], size, 'square');

    this.shape = new Square([x,y], size, [250, 235, 44, 255]);
    this.collider = new SquareCollider(this.shape);
  }
}

class TriangleWave extends WaveShape {
  constructor([x,y], size) {
    // Call the orginal ctor
    super([x,y], size, 'triangle');

    this.shape = new Triangle([x,y], size, [233, 0, 255, 255]);
    // TODO: Update to triangle collision
    this.collider = new SquareCollider(this.shape);
  }
}

class SawtoothWave extends WaveShape {
  constructor([x,y], size) {
    // Call the orginal ctor
    super([x,y], size, 'sawtooth');

    this.shape = new Sawtooth([x,y], size, [245, 39, 137, 255]);
    // TODO: Update to triangle collision
    this.collider = new SquareCollider(this.shape);
  }
}
