/* import BABYLON */
var BABYLON = window.require_global.BABYLON;
/*
/*
    Particle
*/
Particle = function(scene,charge,X,Y,Z) { // constructor
    // attach base object (the view), and add the object to the scene
    this.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", 2, scene);

	this.sphere.position = {
        x : X,
        y : Y,
        z : Z,
    }

	
	this.charge = charge;
};

module.exports = Particle;
