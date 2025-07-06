/*!
 *  \author Manoel McCadden
 *  \date   06-23-25
 *  \file   oscillator.js
 *  \par
 *    A file containing all the oscillation related classes and functions
 */

/*!
 *  Base class for oscillators
 */
class Osc {
  /*!
   *  Constructs a new oscillator with the given type
   */
  constructor(oscType) {
    this.osc = new p5.Oscillator(oscType);
    this.freq = 0;
    this.lgFreq = 0;
    this.amp = 0;
    this.volume = 0;
    this.playing = false;
  }

  get Freq() {
    return this.freq;
  }

  get Amp() {
    return this.amp;
  }

  get Playing() {
    return this.playing;
  }

  get Volume() {
    return this.volume;
  }

  SetVolume(volume) {
    this.volume = volume;
    this.osc.volume(this.volume);
  }

  SetFreq(freq) {
    this.freq = freq;
    this.osc.freq(this.freq);
  }

  SetAmp(amp) {
    this.amp = amp;
    this.osc.amp(this.amp);
  }

  AddModulation(modulation) {
    // NOTE: instead of having the modulation hold the base freq we will
    // not adjust the base freq and instead adjust the freq in for the osc
    // in the oscillators update function
    // TODO: Add modulation with a key bind and by creating a new modulation
    // object instead of taking one as a param
    this.modulation = modulation;
  }

  Play() {
    this.osc.start();
    this.playing = true;
  }

  Stop() {
    this.osc.stop();
    this.playing = false;
  }

  Update() {
    let outFreq = this.freq;

    if(this.modulation != 'undefined') {
      
    }
  }
}

class Modulation {
  constructor(modAmount, modTime) {
    this.modAmount = modAmount;
    this.modTime = modTime;
  }

  get ModAmount() {
    return this.modAmount;
  }

  get ModTime() {
    return this.modTime;
  }

  SetModAmount(modAmount) {
    this.modAmount = modAmount;
  }

  SetModTime(modTime) {
    this.modTime = modTime;
  }
  
  get NextModValue() {
    // TODO: Find a good way to interpolate between 0 to negative modAmt then
    // to positive modAmt and back to 0 within modTime properly then
    // return the result of this
  }
}
