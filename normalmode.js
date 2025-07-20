/*!
 *  \author Manoel McCadden
 *  \date   06-26-25
 *  \file   normalmode.js
 *  \par
 *    Handles normal mode functionality 
 */

//====================//
//= Normal Variables =//
//====================//

//====================//
//= Normal Functions =//
//====================//

function DrawSelectionGUI() {
  
}

function NormalEvents() {
  // If a wave is selected and LEFT-SHIFT (16) is down then move it 
  // to the current mouse position
  if(selectedWave != 'undefined' && keyIsDown(16) == true) {
    selectedWave.SetPos([mouseX, mouseY]);
  }
  
}

function NormalUpdate() {
  NormalEvents();
}

