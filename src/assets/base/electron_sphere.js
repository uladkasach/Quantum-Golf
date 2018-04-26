var BABYLON = window.require_global.BABYLON;
var dev_mode = true;

var ElectronSphere = function(scene, radius){
    // defaults
    if(typeof radius == "undefined") radius = 1;

    // create sphere
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:radius*2, segments: 6}, scene);

    // add transparency and color
    var trap_material = new BABYLON.StandardMaterial("sphere_material", scene);
    sphere.material = trap_material;

    // dev tool
    if(dev_mode){
        sphere.material.wireframe = true;
    } else {
        sphere.material.alpha = 0; // invisible
    }

    // append to root
    this.base_object = sphere;
}

ElectronSphere.prototype = {
    update_position : function(position){
        // use the emitter to update where the particle system is
        this.base_object.position = position;
    },
    update_scale : function(scale){
        this.base_object.scaling = {
            x : scale,
            y : scale,
            z : scale,
        }
    }
}
module.exports = ElectronSphere;
