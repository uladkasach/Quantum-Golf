var BABYLON = window.require_global.BABYLON;
var Electron = require("./../assets/electron.js");
var ParticleSystem = require("./../assets/particle_system.js");
var Aimer = require("./../assets/aimer.js");

module.exports = async function (engine, canvas) {
    var scene = new BABYLON.Scene(engine);

    // Setup environment
    var light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 2, 8), scene);
    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 20, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    // create electron
    var electron = new Electron(scene);

    // create aiming pointer
    var aimer = new Aimer(scene);
    await aimer.show(); // initialize with aimer showing
    await aimer.position({x:1, y:1, z:0});
    await aimer.initialize(electron);


    // load the arrow object
    /*
    var arrow = BABYLON.SceneLoader.ImportMeshAsync(null, "/src/_static_resources/objects/", "arrow.obj", scene)
        .then((result)=>{
            var meshes = result.meshes;
            return meshes[0];
        })
    arrow.position = {x:1, y:2, z:1};

    */


    // return the scene
    return scene;
}
