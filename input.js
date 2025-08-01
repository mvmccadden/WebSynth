/*!
 *  \author Manoel McCadden
 *  \date   06-24-25
 *  \file   input.js
 *  \par
 *    Handles input with keys and mouse for p5
 */

/*!
 *  Handles enter functionality by interperting different 
 *  string command pre-fixes
 */
// TODO: Change how text works so that it can display numbers and chars as one
// unit and can convert them by splicing the front event of the string as a 
// command and the back end as a number
function EnterInterp(strVal, posVal) {
  if(selectedWave != 'undefined') {
    let [x,y] = selectedWave.Pos;
    if(strVal == 'fq') {
      x = constrain(map(posVal, 0, 2000, 0, windowSize.x), 0, windowSize.x);
    }
    else if(strVal == 'ap') {
      y = constrain(map(posVal, 100, 0, 0, windowSize.y), 0, windowSize.y);
    }
    selectedWave.SetPos([x,y]);
    // Update the object so both the osc and the position of the visual
    // shape update properly but don't deselect incase we want to continue
    // adjusting after entering
    selectedWave.Update();
  }
  // If we are not modifying a selected unit then attempt to spawn a 
  // new wave object
  else {
    SpawnWave(strVal);
  }
}

/*!
 *  If a key is pressed and it is a number based key then track it so that
 *  we can update an objects position if an object is selected
 */
function keyPressed() {
  // If tilde (`) is hit swap the state 
  if(key == '`') {
    // Exit the previous mode if it has an exit function
    if(MODES[activeMode].exit != 'undefined') {
      MODES[activeMode].exit();
    }
    activeMode = (activeMode + 1) % MODES.length;
    modeText.SetString(MODES[activeMode].text)
    // Init the new mode if it has an init function
    if(MODES[activeMode].init != 'undefined') {
      MODES[activeMode].init();
    }
  }
  
  // If in midi mode do midi events
  if(activeMode == 1) {
    MidiKeyPressed();
    return;
  }

  // TODO: change so that this is a seperate function for osc mode


  let posVal = displayText.Value;
  let strVal = displayText.String;

  if(key == '0') {
    posVal *= 10;
  }
  else if(key == '1') {
    posVal *= 10;
    posVal += 1;
  }
  else if(key == '2') {
    posVal *= 10;
    posVal += 2;
  }
  else if(key == '3') {
    posVal *= 10;
    posVal += 3;
  }
  else if(key == '4') {
    posVal *= 10;
    posVal += 4;
  }
  else if(key == '5') {
    posVal *= 10;
    posVal += 5;
  }
  else if(key == '6') {
    posVal *= 10;
    posVal += 6;
  }
  else if(key == '7') {
    posVal *= 10;
    posVal += 7;
  }
  else if(key == '8') {
    posVal *= 10;
    posVal += 8;
  }
  else if(key == '9') {
    posVal *= 10;
    posVal += 9;
  }
  else if(key == 'Escape')
  {
    posVal = 0;
    strVal = "";
  }
  else if(key == 'Backspace')
  {
    if(posVal != 0) {
      posVal -= posVal % 10;
      posVal /= 10;
    }
    // If no values exists in the numeral value then check the string value...
    // if there exists a value in the string value then slice off all values
    // but the last [0, -1], where -1 means 1 from the end and replace it
    // with the previous strVal
    else if(strVal != ""){
      strVal = strVal.slice(0, -1);
    }
  }
  else if(key == 'Enter') {
    EnterInterp(strVal, posVal);
    strVal = "";
    posVal = 0;
  }
  else if(key >= 'a' && key <= 'z'){
    strVal += key;
  }

  displayText.SetString(strVal);
  displayText.SetValue(posVal);
}

function keyReleased() {
  if(activeMode == 1) {
    MidiEvents();
  }
}

