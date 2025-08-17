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
    this.cornerRadius = 40;

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

    const textWidth = this.w - this.w / 20 * 6;
    const titleHeight = TITLE_TEXT_SIZE;
    const descHeight = this.h / 2 - titleHeight - this.h / 20;

    this.controlsTitle = new Text([this.x + this.w / 10, this.h - this.h / 2]
      , [COLOR_WHITE.r, COLOR_WHITE.g, COLOR_WHITE.b, 255]
      , "Controls: ", TITLE_TEXT_SIZE, "", true, false);
    this.controlsDescription = new Text2(
      [this.controlsTitle.PosX + this.w / 20
        , this.controlsTitle.PosY + titleHeight]
      , SMALL_TEXT_SIZE, textWidth, descHeight, COLOR_WHITE.r
      , 'Spawn a wave shape by dragging the shape onto the frequency map.'
      + '\n\n- Swap waves with Left and Right'
      + '\n- Adjust amp with Up and Down'
      + '\n- Toggle sustain with Left Shift'
      + '\n- Adjust octaves with Z and X'
      + '\n- Keyboard starts on A key (C4)'
      + '\n\nOrange = Selected'
      + '\nBlack = Unselected'
      + '\nGreen = Playing Unselected'
    );
  }

  Draw() {
    fill(COLOR_GRAY);

    rect(this.x, this.y, this.w, this.h, this.cornerRadius);

    for(const spawner of this.spawners) {
      spawner.Draw();
    }

    this.controlsTitle.Print();
    this.controlsDescription.Draw();
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
