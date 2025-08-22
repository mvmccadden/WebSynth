/*!
 *  \author Manoel McCadden
 *  \date   06-26-25
 *  \file   midimode.js
 *  \par
 *    Handles updating during midi mode
 */

//===============//
//= Midi Consts =//
//===============//
const MIDI_NOTES = [
  {note: 'A', pow: -9}, // A
  {note: 'W', pow: -8}, // W
  {note: 'S', pow: -7}, // S
  {note: 'E', pow: -6}, // E
  {note: 'D', pow: -5}, // D
  {note: 'F', pow: -4}, // F
  {note: 'T', pow: -3}, // T
  {note: 'G', pow: -2}, // G
  {note: 'Y', pow: -1}, // Y
  {note: 'H', pow: 0}, // H
  {note: 'U', pow: 1}, // U 
  {note: 'J', pow: 2}, // J
  {note: 'K', pow: 3}, // K
  {note: 'O', pow: 4}, // O
  {note: 'L', pow: 5}, // L
  {note: 'P', pow: 6}, // P
  {note: ';', pow: 7} // ;
]

const OCTAVE = 12;
const MIN_OCTAVE = -4;
const MAX_OCTAVE = 4;
const AFOUR = 440;
const KEY_COUNT = 12;
const INVALID_KEY = -11;

const TOTAL_OCTAVES = 8;

const SUSTAINON = {
  text: "Sustain: ON", 
  color: COLOR_GREEN
};

const SUSTAINOFF = {
  text: "Sustain: OFF", 
  color: COLOR_RED
};

//==================//
//= Midi variables =//
//==================//
// An array used as a stack which keeps tracks of which notes have been pressed 
let playingNotes = [];
let freqSpectrum = [];

let selectionBox;

//==================//
//= Midi Functions =//
//==================//

function UpdateSustainText() {
  // Verify selected wave exists
  if(selectedWave == 'undefined') {
    return;
  }
  // Update extra info string as needed
  if(selectedWave.Sustain == true) {
    extraInfoText.SetString(SUSTAINON.text); 
    extraInfoText.SetColor([SUSTAINON.color.r, SUSTAINON.color.g
      , SUSTAINON.color.b, 255]);
  }
  else {
    extraInfoText.SetString(SUSTAINOFF.text); 
    extraInfoText.SetColor([SUSTAINOFF.color.r, SUSTAINOFF.color.g
      , SUSTAINOFF.color.b, 255]);
  }
}

/*!
 *  Updates the midi info text with the key/note being played
 *  the frequency of the note and the amplitude of the note
 *
 *  \param keyValue
 *    The key/note being played
 *  \param freq
 *    The freq of the key/note
 *  \param amp
 *    The amplitude the note/key is being played at
 */
// TODO: Currently midi info text updates on second press not first
function UpdateMidiInfoText(keyValue, freq, amp) {
  let catString = "";
  let noteValue = "";
  // Get the current octave of the majority of keys active
  let octaveValue = 4 + selectedWave.Octave;

  // Set the octave to the correct octave if the note is on the 
  // upper half of keys
  if(keyValue > 2) {
    ++octaveValue;
  }

  // Find out what the note value is
  if(keyValue == -9 
    || keyValue == 3) {
    noteValue = "C";
  }
  else if(keyValue == -8
    || keyValue == 4) {
    noteValue = "C#/Db";
  }
  else if(keyValue == -7
    || keyValue == 5) {
    noteValue = "D";
  }
  else if(keyValue == -6
    || keyValue == 6) {
    noteValue = "D#/Eb";
  }
  else if(keyValue == -5
    || keyValue == 7) {
    noteValue = "E";
  }
  else if(keyValue == -4) {
    noteValue = "F";
  }
  else if(keyValue == -3) {
    noteValue = "F#/Gb";
  }
  else if(keyValue == -2) {
    noteValue = "G";
  }
  else if(keyValue == -1) {
    noteValue = "G#/Ab";
  }
  else if(keyValue == 0) {
    noteValue = "A";
  }
  else if(keyValue == 1) {
    noteValue = "A#/Bb";
  }
  else if(keyValue == 2) {
    noteValue = "B";
  }
  // TODO: Find a way to show no note if thier is no valid midi note passed
  
  // Add the octave and note values to the string
  if(keyValue != INVALID_KEY) {
    catString += noteValue + octaveValue.toString() + " ";
  }
  // Add the frequency and amplitude to the string 
  // and round the decimal to the 2nd decimal place
  catString += "Frequency: " + freq.toFixed(2) 
    + " Amplitude: " + amp.toFixed(2);

  // Place the string into the displayinfostring
  displayText.SetString(catString);
}

/*!
 *  Update the octave of the selected wave
 */
function UpdateOctave(direction) {
  if(selectedWave == 'undefined') {
    return;
  }

  let midiOctave = selectedWave.Octave;
  if(direction == 'up') {
    midiOctave = constrain(midiOctave + 1, MIN_OCTAVE, MAX_OCTAVE);
  }
  else {
    midiOctave = constrain(midiOctave - 1, MIN_OCTAVE, MAX_OCTAVE);
  }
  selectedWave.SetOctave(midiOctave);
}

/*!
 *  Deletes the selected wave, remove it from the playing notes, and
 *  move the selected wave to the next in the queue if it exists
 */
function DeleteWave() {
  if(selectedWave == 'undefined') {
    return;
  }

  let numOfElements = 1;

  const selectedWaveIndex = waves.findIndex(wave => wave.ID === selectedWave.ID);
  selectedWave.Stop();
  selectedWave.Unselect();
  waves.splice(selectedWaveIndex, numOfElements);
  ArrowSelect('left');
}

/*!
 *  Turns off all playing notes
 */
function StopAllNotes() {
  if(selectedWave != 'undefined') {
    selectedWave.Unselect();
  }

  for(const wave of waves) {
    wave.Stop();
  }
}

/*!
 *  Handles events during the MIDI mode
 */
function MidiEvents() {
  // Only do midi events if a wave is selected
  // Additionally reset all strings if no wave is selected
  if(selectedWave == 'undefined') {
    displayText.SetString("");
    extraInfoText.SetString("");
    return;
  }

  // Update the sustain text first since the rest of the function
  // doesn't update the sustain state
  UpdateSustainText();

  let [x,y] = selectedWave.Pos;
  // We start at A4 (440Hz) at (H) and move from there
  let posVal = 'undefined'; 
  // Hold the value for i so we can get the playing note that we select late
  let i = 0;

  // Get the most recently played note by getting the last note added 
  // to the stack. If it is still down play it... if not then pop it and
  // move onto the next note unless sustain is active then play the note
  // Multiply the frequency by the note value if the note is pressed
  // TODO: Add an ability for shift to be pressed or held with a key in order
  // to have it be held after any note stops playing. Like a flag that gets set
  for(i = playingNotes.length - 1; i >= 0; --i) {
    // Convert the first char (the note value) to an ascii digit value
    if(keyIsDown(playingNotes[i].note.charCodeAt(0))
      || selectedWave.Sustain == true) {
      // leave the loop a valid key is found from the stack
      // and set the current note being played
      selectedWave.SetLastestNote(playingNotes[i]);
      break;
    }
    // If the most recently added note is no longer being played then 
    // pop it off the stack
    else {
      playingNotes.pop();
    }
  }

  // If i is less than 0 then we were unable to find a currently playing note 
  // so we pause playing of the selected wave as it no longer needs to be place 
  // and can allow for double clicking notes. 
  // We also return as we don't want to use the undefined value later
  // and risk causing undefined errors
  if(i < 0) {
    selectedWave.Stop();
    UpdateMidiInfoText(selectedWave.LatestNote.pow
      , selectedWave.Freq, selectedWave.Amp);
    return;
  }

  // TODO: see if we can adjust so that this is only updated when a key 
  // is either lifted or pressed
  posVal = Math.log(AFOUR 
    * Math.pow(2, (selectedWave.LatestNote.pow + selectedWave.Octave * 12)/12));
  // Set the new x pos and then update the wave
  x = constrain(map(posVal, MIN_LOG_FREQ, MAX_LOG_FREQ, 0
    , windowSize.x), 0, windowSize.x);
  selectedWave.SetPos([x,y]);
  selectedWave.Update();

  // In case the note is currently off (which will only happen if 
  // sustain is off) then start playing the note
  if(selectedWave.Playing == false){
    selectedWave.Play();
  }

  // Update the midi info shown on screen using the updated values
  UpdateMidiInfoText(selectedWave.LatestNote.pow
    , selectedWave.Freq, selectedWave.Amp);
}

/*!
 *  Handles functionality for key presses during midi mode
 */
function MidiKeyPressed() {
  if(key == 'z') {
    UpdateOctave('down');
  }
  else if(key == 'x') {
    UpdateOctave('up');
  }
  else if(key == 'Shift') {
    // If a wave is selected then toggle sustain properties on 
    // it during midi mode
    if(selectedWave != 'undefined') {
      selectedWave.ToggleSustain();
    }
  }
  else if(key == 'ArrowRight') {
    ArrowSelect('right');
  }
  else if(key == 'ArrowLeft') {
    ArrowSelect('left');
  }
  else if(key == 'ArrowUp') {
    ArrowAmpAdjust('up');
  }
  else if(key == 'ArrowDown') {
    ArrowAmpAdjust('down');
  }
  else if(key == 'Backspace') {
    DeleteWave();
  }
  else if(key == 'Escape') {
    StopAllNotes();
  }
  // If the octave isn't being adjust then check all keys for pressed
  else {
    for(const note of MIDI_NOTES) {
      // If the note is playing add it to the stack so it can be checked on 
      // update in order of call as we are using a MONO synth
      if(key == note.note.toLowerCase()) {
        playingNotes.push(note);
        // Leave the loop when a key is found since only one key will be 
        // triggered for each call
        break;
      }
    }
  }
}

/*!
 *  Set the defaults for the frequency spectrum dividor and text
 */
function CreateFreqSpectrum() {
  // Reset the array to create new spectrum objects
  freqSpectrum.length = 0;
  
  freqSpectrum.push(new VerticalDividor(CalculateFrequencyPosition(21)
    , "A0"));
  freqSpectrum.push(new VerticalDividor(CalculateFrequencyPosition(33)
    , "A1"));
  freqSpectrum.push(new VerticalDividor(CalculateFrequencyPosition(45)
    , "A2"));
  freqSpectrum.push(new VerticalDividor(CalculateFrequencyPosition(57)
    , "A3"));
  freqSpectrum.push(new VerticalDividor(CalculateFrequencyPosition(69)
    , "A4 (440Hz)"));
  freqSpectrum.push(new VerticalDividor(CalculateFrequencyPosition(81)
    , "A5"));
  freqSpectrum.push(new VerticalDividor(CalculateFrequencyPosition(93)
    , "A6"));
  freqSpectrum.push(new VerticalDividor(CalculateFrequencyPosition(105)
    , "A7"));
  freqSpectrum.push(new VerticalDividor(CalculateFrequencyPosition(117)
    , "A8"));
}

/*!
 *  Calculates the x pos of a given midi key
 */
function CalculateFrequencyPosition(val) {
  let posVal = Math.log(AFOUR 
    * Math.pow(2, (val - 69)/12));
  // Set the new x pos and then update the wave
  return constrain(map(posVal, MIN_LOG_FREQ, MAX_LOG_FREQ, 0
    , windowSize.x), 0, windowSize.x);
}

/*!
 *  Draw the freq spectrum
 */
function DrawFreqSpectrum() {
  for(let i = 0; i < freqSpectrum.length; ++i) {
    freqSpectrum[i].Draw();
  }
}

/*!
 *  Inits the midi layer when the mode is activated
 */
function MidiInit() {
  CreateFreqSpectrum();
  if(selectedWave != 'undefined') {
    UpdateSustainText();
  }
}

/*!
 *  Update the midi layer when the mode is active
 */
function MidiUpdate() {
  DrawFreqSpectrum();
  MidiEvents();
}

/*!
 *  Exits the midi layer when the mode is disabled
 */
function MidiExit() {
  // Reset sustain text back to an empty state
  extraInfoText.SetString("");
}
