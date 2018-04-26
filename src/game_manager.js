var BABYLON = window.require_global.BABYLON;

/*
    this file holds the overarching game logic
        - controls checking if user should be shown options to shoot electron
*/
var Game_Manager = function(electron, aimer){
    // store reference to electron and traps
    this.course = {
        electron : electron,
        aimer : aimer,
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
        var direction = this.course.aimer.get_direction();
        var magnitude = 0.1; // TODO get magnitude
        var certainty = 0.2; // TODO get certainty
        this.course.electron.launch(direction, magnitude, certainty);
        this.state.aiming = false;
    },

    /*
        state monitors
    */
    update : function(){
        if(!this.state.aiming) this.toggle_aiming_if_needed();
    },
    toggle_aiming_if_needed : function(){
        var controls_needed = true; // TODO, determine if we are in a electron trap
        if(!controls_needed) return; // do nothing if not needed
        this.state.aiming = true;
        this.course.aimer.initialize(this.course.electron);
    },
    determine_if_won : function(){
        // TODO, determien if we won
    }
}
module.exports = Game_Manager;
