var BABYLON = window.require_global.BABYLON;
var Electron = require("./../assets/electron.js");
var ParticleSystem = require("./../assets/particle_system.js");

module.exports = function (engine, canvas) {
    var scene = new BABYLON.Scene(engine);

    // Setup environment
    //var light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 2, 8), scene);
    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 20, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);


    // create particle system
    // var particle_swarm = new ParticleSystem(scene);


    // create electron
    var electron = new Electron(scene);

    return scene;
}
