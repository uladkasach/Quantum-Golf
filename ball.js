// The babylon engine
var engine;
// The current scene
var scene;
// The HTML canvas
var canvas;
// The camera, the ship and the ground will move
var camera, arrow;

// The function onload is loaded when the DOM has been loaded
    document.addEventListener("DOMContentLoaded", function () {
    onload();
}, false);

/**
* Onload function : creates the babylon engine and the scene
*/
var onload = function () { 
    // Engine creation
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    // Scene creation
    initScene();
    // The render function
    engine.runRenderLoop(function () {
	if(!electron.launched){
          arrow.move();
          setLaunchSpeed();
	} else{
	console.log("Print");
	  electron.move();
	}
	//camera.position.y+=1;
        scene.render();
    });
};
var initScene = function() {
    // The scene creation
    scene = new BABYLON.Scene(engine);

    // The camera creation
    //camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 5, -30), scene);
    //camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
    //camera.setTarget(new BABYLON.Vector3(0,0,20));
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(new BABYLON.Vector3(0,0,0));
    //camera.position.y=4;
    //camera.position.z=-8;
    camera.attachControl(canvas, true);
    //camera.setTarget(new BABYLON.Vector3(0,0,0));
    //camera.maxZ = 1000;
    //camera.speed = .5;

    // ball
    electron = new Electron(scene);

    // arrow
    arrow = new Arrow(5, scene);
};
var setLaunchSpeed = function() {
  dx=arrow.position.x-electron.position.x;
  dy=arrow.position.y-electron.position.y;
  dz=arrow.position.z-electron.position.z;
  d=Math.sqrt(dx*dx+dy*dy+dz*dz);
  electron.xComp=electron.speed*dx/d;
  electron.yComp=electron.speed*dy/d;
  electron.zComp=electron.speed*dz/d;
};
