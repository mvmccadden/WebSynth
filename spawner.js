/*!
 *  \author Manoel McCadden
 *  \date   06-23-25
 *  \file   spawner.js
 *  \par
 *    A file containing all the spawner related functions
 */

const DEFAULT_WAVE_SIZE = 50;

class Spawner {
  constructor([x,y]) {
    this.x = x;
    this.y = y;

    this.shape = new Shape([0,0], 0, [0,0,0,0]);
    this.collider = new Collider(this.shape);

    this.spawnOnNextChance = false;
    this.spawnType = '';
  }

  Draw() {
    this.shape.Draw();
  }
  
  Update() {
    // Check the collision state.
    //
    // Follow the mouse to the spawn position
    //
    // If a collision has occured trigger bool to notify update function to 
    // spawn a wave on the next update where the objectis not colliding.
    //
    // Secondary condition is added to ensure that even if you move too quickly 
    // for the shape to keep up with you will retain its position and not 
    // accidentally spawn a shape somewhere you don't want to
    // NOTE: Would be good to look into ensuring this isn't foribly updated 
    // every update loop if possible
    this.collider.Update();
    if(this.collider.Collision == true || 
      (mouseIsPressed == true && this.spawnOnNextChance == true)) {
      this.shape.SetPos([mouseX, mouseY]);
      this.spawnOnNextChance = true;
      console.log("COLLISION");
      return;
    }

    if(this.spawnOnNextChance == false) {
      return;
    }
    // Don't spawn a wave if the user is trying to spawn it outside of the
    // given window size
    if(mouseX <= windowSize.x) {
      SpawnWave(this.spawnType);
    }

    this.shape.SetPos([this.x, this.y]);
    this.spawnOnNextChance = false;
  }
}

class SineSpawner extends Spawner {
  constructor([x,y]) {
    super([x,y]);

    this.spawnType = 'si';

    this.shape = new Circle([x,y], DEFAULT_WAVE_SIZE
      , [SINE_COLOR.r, SINE_COLOR.g, SINE_COLOR.b, SINE_COLOR.a]);
    this.collider = new CircleCollider(this.shape);
  }
}

class TriangleSpawner extends Spawner {
  constructor([x,y]) {
    super([x,y]);

    this.spawnType = 'tr';

    this.shape = new Triangle([x,y], DEFAULT_WAVE_SIZE
      , [TRIANGLE_COLOR.r, TRIANGLE_COLOR.g, TRIANGLE_COLOR.b, TRIANGLE_COLOR.a]);
    this.collider = new SquareCollider(this.shape);
  }
}

class SawtoothSpawner extends Spawner {
  constructor([x,y]) {
    super([x,y]);

    this.spawnType = 'sw';

    this.shape = new Sawtooth([x,y], DEFAULT_WAVE_SIZE
      , [SAWTOOTH_COLOR.r, SAWTOOTH_COLOR.g, SAWTOOTH_COLOR.b, SAWTOOTH_COLOR.a]);
    this.collider = new SquareCollider(this.shape);
  }
}

class SquareSpawner extends Spawner {
  constructor([x,y]) {
    super([x,y]);

    this.spawnType = 'sq';

    this.shape = new Square([x,y], DEFAULT_WAVE_SIZE
      , [SQUARE_COLOR.r, SQUARE_COLOR.g, SQUARE_COLOR.b, SQUARE_COLOR.a]);
    this.collider = new SquareCollider(this.shape);
  }
}

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

