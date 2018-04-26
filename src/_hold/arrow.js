
/**
* A mesh representing the arrow
* @param size The arrow size
* @param scene The scene where the arrow will be created
* @constructor
*/
Arrow = function(size, scene) {
  // Call the super class BABYLON.Mesh
  BABYLON.Mesh.call(this, "arrow", scene);

  // Creates a box
  var vd = BABYLON.VertexData.CreateBox(size);
  // Apply the box shape to our mesh
  vd.applyToMesh(this,false);

  // Its position is in (0,0), and a little bit above the ground.
  this.position.x = 0;
  this.position.z = 4;
  this.position.y = 0;
  //this.rotation.y = 3.1;

  // Movement attributes
  this.moveLeft = false;
  this.moveRight = false;
  this.launched = false;

  this._initMovement();
};

// Our object is a BABYLON.Mesh
Arrow.prototype = Object.create(BABYLON.Mesh.prototype);
// And its constructor is the Arrow function described above.
Arrow.prototype.constructor = Arrow;
Arrow.prototype._initMovement = function() {
      // When a key is pressed, set the movement
      var onKeyDown = function(evt) {
	//console.log("TRIGGERED");
	  // To the left
          if (evt.keyCode == 65) {
              arrow.moveLeft = true;
              arrow.moveRight = false;
          } else if (evt.keyCode == 68) {
              // To the right
              arrow.moveRight = true;
              arrow.moveLeft = false;
          } else if (evt.keyCode == 87){
	      arrow.moveUp = true;
	      arrow.moveDown = false;
	  } else if (evt.keyCode == 83){
	      arrow.moveDown = true;
	      arrow.moveUp = false;
	  }
 	  if (evt.keyCode == 32){
	      arrow.launched=true;
	      arrow.isVisible=false;
	  }
      };

      // On key up, reset the movement
      var onKeyUp = function(evt) {
	if (evt.keyCode == 68)
          arrow.moveRight = false;
	if (evt.keyCode == 65)
          arrow.moveLeft = false;
	if (evt.keyCode == 87)
	  arrow.moveUp = false;
	if (evt.keyCode == 83)
          arrow.moveDown = false;
      };

      // Register events with the right Babylon function
      BABYLON.Tools.RegisterTopRootEvents([{
          name: "keydown",
          handler: onKeyDown
      }, {
          name: "keyup",
          handler: onKeyUp
      }]);
  };

 Arrow.prototype.move = function() {
    if(!arrow.launched){
      if (arrow.moveRight) {
	  arrow.rotate(BABYLON.Axis.Y, .1, BABYLON.Space.LOCAL);
      }
      if (arrow.moveLeft) {
          arrow.rotate(BABYLON.Axis.Y, -.1, BABYLON.Space.LOCAL);
      }
      if (arrow.moveUp) {
          arrow.rotate(BABYLON.Axis.X, .1, BABYLON.Space.LOCAL);
      }
      if (arrow.moveDown) {
          arrow.rotate(BABYLON.Axis.X, -.1, BABYLON.Space.LOCAL);
      }
    }
  };
