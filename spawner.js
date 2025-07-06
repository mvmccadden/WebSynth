/*!
 *  \author Manoel McCadden
 *  \date   06-23-25
 *  \file   spawner.js
 *  \par
 *    A file containing all the spawner related functions
 */

const DEFAULT_WAVE_SIZE = 50;

function SpawnWave(type) {
  if(type == 'si') {
    waves.push(new SineWave([mouseX, mouseY], DEFAULT_WAVE_SIZE));
    waves[waves.length - 1].Select();
  }
  else if(type == 'sq') {
    waves.push(new SquareWave([mouseX, mouseY], DEFAULT_WAVE_SIZE));
    waves[waves.length - 1].Select();
  }
  else if(type == 'tr') {
    waves.push(new TriangleWave([mouseX, mouseY], DEFAULT_WAVE_SIZE));
    waves[waves.length - 1].Select();
  }
  else if(type == 'sw') {
    waves.push(new SawtoothWave([mouseX, mouseY], DEFAULT_WAVE_SIZE));
    waves[waves.length - 1].Select();
  }
}

