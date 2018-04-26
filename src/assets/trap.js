var BABYLON = window.require_global.BABYLON;

var Trap_Base = require("./base/trap_base.js");

var Trap = function(scene, color, id){
    if(typeof id == "undefined") id = new Date() + " " + Math.random(); // date + random number - should be good enough to avoid id collisions
    this.trap = new Trap_Base(scene, 5, 0.15, color);
    this.trap_glow = new Trap_Base(scene, 5.25, 0.075, color);
    this.trap_glow.base_object.parent = this.trap.base_object; // associate
    this.base_object = this.trap.base_object;
    this.id = id;
}

Trap.prototype = {
    position : function(position){
        this.trap.base_object.position = position;
        // this.trap_glow.base_object.position = position; - since it was parented, this is not needed
    }
}

module.exports = Trap;
