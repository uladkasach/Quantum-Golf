Electron = function(scene) {
  //Create Mesh
  BABYLON.Mesh.call(this, "electron", scene);
  var vd = BABYLON.VertexData.CreateSphere(8);
  vd.applyToMesh(this,false);

  // Its position is in (0,0), and a little bit above the ground.
  this.position.x = 0;
  this.position.z = 0;
  this.position.y = 0;

  // Movement attributes
  this.speed=9; //Plan to change this as necessary to modify gameplay
  this.growth=.01; //Plan to change this as necessary to modify gameplay
  //Components of velocity
  this.xComp=0;
  this.yComp=0;
  this.zComp=0;
  this.scale=1;
  this.launched=false;

  this._ready();
};

Electron.prototype = Object.create(BABYLON.Mesh.prototype);
Electron.prototype.constructor = Electron;
Electron.prototype._ready = function(){
  var onKeyDown = function(evt){
    //console.log("TRIGGERED");
    if (evt.keyCode == 32){
      if(!electron.launched){
	console.log("LAUNCH MOTHERFUCKER!!!!!!!!!!!!!");
	//Launch codes
	electron.launched=true;
      }
    }
  };
  
  BABYLON.Tools.RegisterTopRootEvents([{
    name: "keydown",
    handler: onKeyDown
  }]);
};

Electron.prototype.move = function(){
  console.log("x: ");
  console.log(electron.xComp);
  console.log("z: ");
  console.log(electron.zComp);
  if(electron.launched){
    //Collapse Wave Function
    electron.scale+=electron.growth;
    electron.scaling = new BABYLON.Vector3(electron.scale,electron.scale,electron.scale);
    //Move electron
    electron.position.x += electron.xComp;
    electron.position.y += electron.yComp;
    electron.position.z += electron.zComp;
    //Lose electron
    if(electron.scale>3){
      electron.launched = false;
      electron.isVisible=false;
    }
  }
}

//Create method for wave function collapse

//Create method for Coulomb force which will modify x,y,z components

//Create probabilistic collisions and quantum tunneling