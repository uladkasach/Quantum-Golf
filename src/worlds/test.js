var BABYLON = window.require_global.BABYLON;
var Electron = require("./../assets/electron.js");
var ParticleSystem = require("./../assets/particle_system.js");
var Aimer = require("./../assets/aimer.js");

module.exports = async function (canvas) {
    // base objects
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);

    // environment
    var light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 2, 8), scene);
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, false);
    camera.keysUp = [];camera.keysDown = [];camera.keysLeft = [];camera.keysRight = [];

    /*
        entities
    */
    // create electron
    var electron = new Electron(scene);

    // create aiming pointer
    var aimer = new Aimer(scene);
    await aimer.initialize(electron);

    // run loop
    engine.runRenderLoop(function() {
        aimer.update();
        scene.render();
    });
}
