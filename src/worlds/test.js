var BABYLON = window.require_global.BABYLON;
var Electron = require("./../assets/electron.js");
var Aimer = require("./../assets/aimer.js");
var Game_Manager = require("./../game_manager.js");
var Trap = require("./../assets/trap.js");

module.exports = async function (canvas) {
    // base objects
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);

    // environment
    scene.ambientColor = new BABYLON.Color3(1, 1, 1); // add ambient color
    var light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 2, 8), scene);
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, false);
    camera.keysUp = [];camera.keysDown = [];camera.keysLeft = [];camera.keysRight = [];

    /*
        entities
    */

    if(true){
        // create electron
        var electron = new Electron(scene);

        // create aiming pointer
        var aimer = new Aimer(scene);
        //await aimer.initialize(electron);

        // create a trap
        var base_trap = new Trap(scene);

        var green_trap = new Trap(scene, "green");
        green_trap.position({x:0, y:30, z:0})

        var target_trap = new Trap(scene, "red");
        target_trap.position({x:20, y:0, z:0});

        // create game manager
        var game_manager = new Game_Manager(electron, aimer, [base_trap, target_trap]);
    }






    // run loop
    engine.runRenderLoop(function() {
        if(true){
            electron.update();
            aimer.update();
            game_manager.update();
        }
        scene.render();
    });
}
