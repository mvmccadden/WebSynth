/*!
 *  \author Manoel McCadden
 *  \date   06-23-25
 *  \file   drawing.js
 *  \par
 *    A file containg all the drawing functionality that is used for the
 *    web synth
 */

// The default color for text 
const COLOR_WHITE = {
  r: 255, g: 255, b: 255
};
// The default color for vertical dividors
const COLOR_GRAY = 50;
// Some other default colors
const COLOR_RED = {
  r: 255, g: 0, b: 0
};
const COLOR_GREEN = {
  r: 0, g: 255, b: 0
};

const TITLE_TEXT_SIZE = 25;
const DEFAULT_TEXT_SIZE = 25;
const SMALL_TEXT_SIZE = 16;

/*!
 * A base class used to define what shapes are and ensure that all
 * shapes conform to a standard
 */
class Shape {
  constructor([x,y], size, [r,g,b,a]) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  get Pos() {
    return [this.x, this.y];
  }

  get Size() {
    return this.size;
  }

  get Color() {
    return [this.r, this.g, this.b, this.a];
  }

  SetPos([x,y]) {
    this.x = x;
    this.y = y;
  }

  SetSize(size) {
    this.size = size;
  }

  SetColor([r,g,b,a]) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  // NOTE: These functions are empty but placed to ensure that all shapes
  // have a callable draw and update no matter what
  Update() {}
  Draw() {}
}

/*!
 *  An extension of the shape class used for drawing circles
 */
class Circle extends Shape {
  Draw() {
    // Set the color to be used for filling then draw the shape
    let c = color(this.r, this.g, this.b, this.a);
    fill(c);

    circle(this.x, this.y, this.size);
  }
}

/*!
 *  An extension of shape that allows for drawing square
*/
class Square extends Shape {
  Draw() {
    // Set the color to be used for filling then draw the shape
    let c = color(this.r, this.g, this.b, this.a);
    fill(c);

    // Draw shape with vertices to center shape
    beginShape();
    vertex(this.x - this.size/2, this.y - this.size/2, 0);
    vertex(this.x + this.size/2, this.y - this.size/2, 0);
    vertex(this.x + this.size/2, this.y + this.size/2, 0);
    vertex(this.x - this.size/2, this.y + this.size/2, 0);
    endShape();
  }
}

/*!
 *  An extension of shape that allows for drawing sawtooths
 */
class Sawtooth extends Shape {
  Draw() {
    // Set the color to be used for filling then draw the shape
    let c = color(this.r, this.g, this.b, this.a);
    fill(c);

    // Draw shape with vertices to center shape
    beginShape();
    vertex(this.x + this.size/2, this.y - this.size/2, 0);
    vertex(this.x + this.size/2, this.y + this.size/2, 0);
    vertex(this.x - this.size/2, this.y + this.size/2, 0);
    endShape();
  }
}

/*!
 *  An extension of shape that allows for drawing triangles
*/
class Triangle extends Shape {
  Draw() {
    // Set the color to be used for filling then draw the shape
    let c = color(this.r, this.g, this.b, this.a);
    fill(c);

    // Draw shape with vertices to center shape
    beginShape();
    vertex(this.x, this.y - this.size/2, 0);
    vertex(this.x + this.size/2, this.y + this.size/2, 0);
    vertex(this.x - this.size/2, this.y + this.size/2, 0);
    endShape();
  }
}

/*!
 *  A class used to draw some text onto the screen
 */
class Text {
  /*!
   *  Constructs a new text object passed on the passed parameters
   *
   *  \param x
   *    The x pos of the text
   *  \param y
   *    The y pos of the text
   *  \param text
   *    The text being displayed on screen
   *  \param size
   *    The size of the text being displayed
   *  \param value
   *    A value being added to the end of a string
   */
  constructor([x,y], [r,g,b,a], text, size, value, drawValue, drawOnZero) {
    this.string = text; 
    this.size = size;
    this.value = value;

    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    this.drawValue = drawValue;
    this.drawOnZero = drawOnZero;
  }

  get String() {
    return this.string;
  }

  get Value() {
    return this.value;
  }

  get PosX() {
    return this.x;
  }

  get PosY() {
    return this.y;
  }

  SetPos([x,y]) {
    this.x = x;
    this.y = y;
  }

  SetColor([r,g,b,a]) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  SetSize(size) {
    this.size = size;
  }

  SetValue(value) {
    this.value = value;
  }

  SetString(string) {
    this.string = string;
  }

  Print() {
    textSize(this.size);
    fill(this.r, this.g, this.b, this.a);
    if(this.drawValue == true 
      && (this.drawOnZero == true || this.value != 0)) {
      text(this.string + this.value.toString(), this.x, this.y);
    }
    else {
      text(this.string, this.x, this.y);
    }
  }
}

class Text2 {
  constructor([x,y], size, maxWidth, maxHeight, color, string) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;

    this.color = color;

    this.string = string;
  }

  SetPos([x, y]) {
    this.x = x;
    this.y = y;
  }

  SetSize(size) {
    this.size = size;
  }

  SetMaxWidth(maxWidth) {
    this.maxWidth = maxWidth;
  }

  SetMaxHeight(maxHeight) {
    this.maxHeight = maxHeight;
  }

  SetColor(color) {
    this.color = color;
  }

  SetString(string) {
    this.string = string;
  }

  get Pos() {
    return [this.x, this.y];
  }

  get Size() {
    return this.size;
  }

  get MaxWidth() {
    return this.maxWidth;
  }

  get MaxHeight() {
    return this.maxHeight;
  }

  get Color() {
    return this.color;
  }

  get String() {
    return this.string;
  }

  Draw() {
    fill(this.color);
    textSize(this.size);
    text(this.string, this.x, this.y, this.maxWidth, this.maxHeight);
  }
}

/*!
 *  A class used to draw vertical line dividors with optional text 
 */
class VerticalDividor {
  constructor(x, string) {
    this.x = x;
    this.y_a = 0;
    this.y_b = windowSize.y;

    this.x_txt = x + 10;
    this.y_txt = Math.abs((this.y_a - this.y_b)/2);

    this.string = string;
  }

  Draw() {
    fill(COLOR_GRAY);
    line(this.x, this.y_a, this.x, this.y_b);
    textSize(SMALL_TEXT_SIZE);
    text(this.string, this.x_txt, this.y_txt);
  }
}
