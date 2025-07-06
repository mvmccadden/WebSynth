/*!
 *  \author Manoel McCadden
 *  \date   06-23-25
 *  \file   collider.js
 *  \par
 *    A file that handles collisions between shapes and mouse coords
 */

/*!
 *  A base collider that setups the baseline required functionality 
 *  for colliders
 */
class Collider {
  constructor(entity) {
    // Attach an entity to the collider
    this.entity = entity;
    // Sets the default state for collisions to false
    this.collision = false;

    console.log(entity.Pos);
  }

  OverrideCollision(collision) {
    this.collision = collision
  }

  Update() {}

  get Collision() {
    return this.collision;
  }
}

/*!
 *  An extension of a collider handling square collisions
 */
class SquareCollider extends Collider {
  /*!
   *  Since we are always checking with mouse coords we will only check for 
   *  mouse collisions with update
   */
  Update() {
    // Get the entities values
    const [x,y] = this.entity.Pos;
    const size = this.entity.Size;

    // Create collision data points based on the pos and size
    const xMin = x - size/2;
    const xMax = x + size/2;
    const yMin = y - size/2;
    const yMax = y + size/2;

    if(mouseX > xMin && mouseX < xMax 
      && mouseY > yMin && mouseY < yMax
      && mouseIsPressed == true) {
      this.collision = true;
    }
    else {
      this.collision = false;
    }
  }
}

/*!
 *  An extension of a collider handling circle collisions
 */
class CircleCollider extends Collider {
  /*!
   *  Since we are always checking with mouse coords we will only check for 
   *  mouse collisions with update
   */
  Update() {
    // Get the entities values
    const [x,y] = this.entity.Pos;
    const diameter = this.entity.Size / 2;

    // Get the distance from of the mouse from the center (x,y) using
    // the pythagorean theorm a^2 + b^2 = c^2 where c^2 is the distance
    // from the mouse to the center of the shape. If this distance
    // is greater than the diameter the mouse is not colliding
    const a = mouseX - x;
    const b = mouseY - y;
    const c = Math.sqrt((a * a) + (b * b));

    if(c < diameter && mouseIsPressed == true) {
      this.collision = true;
    }
    else {
      this.collision = false;
    }
  }
}
