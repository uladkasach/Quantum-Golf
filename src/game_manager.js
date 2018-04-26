var BABYLON = window.require_global.BABYLON;

/*
    this file holds the overarching game logic
        - controls checking if user should be shown options to shoot electron
*/
var Game_Manager = function(electron, aimer, traps){
    // normalize data
    if(typeof traps == "undefined") traps = []; // if not defined, default to empty
    if(!Array.isArray(traps)) traps = [traps]; // if traps is not an array, cast to an array

    // store reference to electron and traps
    this.course = {
        electron : electron,
        aimer : aimer,
        traps : traps,
    };
    this.state = {
        aiming : false,
    }

    // add keybindings
    BABYLON.Tools.RegisterTopRootEvents([
        { name: "keydown", handler: this.on_keydown.bind(this), },
    ]);
}
Game_Manager.prototype = {
    /*
        action handling
    */
    on_keydown : function(event){
        if(event.keyCode == 32 && this.state.aiming) this.launch();
    },
    launch : function(){
        this.state.aiming = false;
        this.course.aimer.remove();
        var direction = this.course.aimer.get_direction();
        var magnitude = 0.05; // TODO get magnitude
        var certainty = 0.05; // TODO get certainty
        this.course.electron.launch(direction, magnitude, certainty);
    },

    /*
        state monitors
    */
    update : function(){
        this.determine_if_in_trap();
        this.toggle_aiming_if_needed();
    },
    toggle_aiming_if_needed : function(){
        if(this.state.aiming) return; // if already aiming, no need to compute anything. done.

        // determine if we are in a trap
        var controls_needed = !this.course.electron.moving; //  if we are moving, no controls are needed
        if(!controls_needed) return; // do nothing if not needed

        // if we are in a trap and not trying to leave it, start aiming
        this.state.aiming = true;
        this.course.aimer.initialize(this.course.electron);
    },
    determine_if_in_trap : function(){
        if(this.state.aiming) return; // if aiming, we are in a trap; no need to compute and waste resources
        var in_trap = false;
        for(var i = 0; i < this.course.traps.length; i++){
            var trap = this.course.traps[i];
            var intersects = this.course.electron.sphere.base_object.intersectsMesh(trap.base_object, false);
            if(intersects){
                var target_trap = trap;
                in_trap = true; // found an intersection
                break;
            }
        }
        this.course.electron.in_trap = in_trap; // update electrons state
        if(this.course.electron.just_entered_trap) this.course.electron.move_into_trap(target_trap);
    },
    determine_if_won : function(){
        // TODO, determien if we won
    }
}
module.exports = Game_Manager;
