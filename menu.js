/*!
 *  \author Manoel McCadden
 *  \date   06-23-25
 *  \file   menu.js
 *  \par
 *    File used to draw the menu for selecting waves and getting info
 */

const NUMBER_OF_SPAWNERS = 4;

// The main gui for drawing the gui enviorment
let gui;

class GUI {
  constructor() {
    // Set the size and position of the 
    this.w = windowSize.x / 5;
    this.h = windowSize.y;
    this.x = windowSize.x - this.w;
    this.y = 0;

    this.spawners = [];

    let widthThird = this.w/3

    let pointA_X = this.x + widthThird;
    let pointB_X = pointA_X + widthThird;
    let pointA_Y = this.h/8;
    let pointB_Y = this.h/4;


    this.spawners.push(new SineSpawner([pointA_X, pointA_Y]));
    this.spawners.push(new SquareSpawner([pointB_X, pointA_Y]));
    this.spawners.push(new TriangleSpawner([pointA_X, pointB_Y]));
    this.spawners.push(new SawtoothSpawner([pointB_X, pointB_Y]));
  }

  Draw() {
    let c = color(COLOR_WHITE.r, COLOR_WHITE.g, COLOR_WHITE.b, 255);
    fill(c);

    rect(this.x, this.y, this.w, this.h);

    for(const spawner of this.spawners) {
      spawner.Draw();
    }
  }

  Update() {
    for(const spawner of this.spawners) {
      spawner.Update();
    }
  }

  get PosX() {
    return this.x;
  }

  get PosY() {
    return this.y;
  }
}
