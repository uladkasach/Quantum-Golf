var BABYLON = window.require_global.BABYLON;

/*
    this file holds the overarching game logic
        - controls checking if user should be shown options to shoot electron
*/
var Game_Manager = function(electron, aimer, traps, particles){
    // normalize data
    if(typeof traps == "undefined") traps = []; // if not defined, default to empty
    if(!Array.isArray(traps)) traps = [traps]; // if traps is not an array, cast to an array

    // store reference to electron and traps
    this.course = {
        electron : electron,
        aimer : aimer,
        traps : traps,
        particles : particles,
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
        var aiming = this.course.aimer.get_aim();
        console.log(aiming);
        var direction = aiming.direction;
        var magnitude = aiming.magnitude;
        var certainty = aiming.certainty;
        this.course.electron.launch(direction, magnitude, certainty);
    },

    /*
        state monitors
    */
    update : function(){
        this.determine_if_in_trap();
        this.toggle_aiming_if_needed();
        this.reset_if_lost();
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
            if(!in_trap){
                this.coulomb_force();
            }
        }
        this.course.electron.in_trap = in_trap; // update electrons state
        if(this.course.electron.just_entered_trap) this.course.electron.move_into_trap(target_trap);
    },
    determine_if_won : function(){
        // TODO, determien if we won
    },
    coulomb_force : function(){
		var COULOMB_CONSTANT = 0.06; //Modify to make gameplay work
		//console.log("HERE");
		//console.log(particles);
		for(p in this.course.particles){
			//console.log(p);
			dx = this.course.electron.position.x - this.course.particles[p].sphere.position.x;
			dy = this.course.electron.position.y - this.course.particles[p].sphere.position.y;
			dz = this.course.electron.position.z - this.course.particles[p].sphere.position.z;
			
			dsq = dx*dx+dy*dy+dz*dz;
			f1 = COULOMB_CONSTANT/dsq;
			f = this.course.particles[p].charge*COULOMB_CONSTANT/dsq;
			var fuck=1/100;
			vx = f*dx/Math.sqrt(dsq);
			vy = f*dy/Math.sqrt(dsq);
			vz = f*dz/Math.sqrt(dsq);
			if(vx!=0){
				console.log(f);
				console.log(vx);
			}
			this.course.electron.obey_coulomb_force(vx,vy,vz);
		}
	},
    reset_if_lost : function(){
        if(this.course.electron.hidden){
            this.course.electron.update_position({x:0, y:0, z:0});
            this.course.electron.show();
        }
    }
}
module.exports = Game_Manager;
