var BABYLON = window.require_global.BABYLON;

var Trap_Base = function(scene, size, opacity, color){
    // defaults
    if(typeof color == "undefined") color = "teal";

    // casting
    if(color == "teal") color =  BABYLON.Color3.Teal();
    if(color == "red") color =  BABYLON.Color3.Red();
    if(color == "green") color = BABYLON.Color3.Green();

    // create mesh - http://www.babylonjs-playground.com/#2D4YCM
    var box = BABYLON.MeshBuilder.CreateBox("box", {size:size}, scene);
    var sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2*Math.sqrt(2*Math.pow(size/2,2))}, scene);
    var boxCSG = BABYLON.CSG.FromMesh(box);
    var sphereCSG = BABYLON.CSG.FromMesh(sphere);
    var diceCSG = boxCSG.intersect(sphereCSG);
    var dice = diceCSG.toMesh("dice", null, scene);
    box.dispose();
    sphere.dispose();
    var trap = dice;

    // add transparency and color
    var trap_material = new BABYLON.StandardMaterial("trap_material", scene);
    trap_material.alpha = opacity;
    trap_material.emissiveColor = color;
    trap.material = trap_material;

    // add glow
    var gl = new BABYLON.GlowLayer("glow", scene);
    gl.addIncludedOnlyMesh(trap) // glow only the box

    this.base_object = dice;
}

module.exports = Trap_Base;
