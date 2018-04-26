/*
    this file holds the overarching game logic
        - controls checking if user should be shown options to shoot electron
*/
var Game_Manager = function(electron, traps){
    // store reference to electron and traps
    this.course = {
        electron : electron,
        traps : traps,
    };
}
Game_Manager.prototype = {
    determine_if_controls_needed : function(){
        // TODO, determine if we are in a electron trap
        
    },
    determine_if_won : function(){
        // TODO, determien if we won
    }
}
