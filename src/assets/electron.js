/* import BABYLON */
var BABYLON = window.require_global.BABYLON;
var ParticleSystem = require("./particle_system.js");

/*
    constants
*/
var uncertainty_constant = {
    position : {
        time_weight : 1,
        scaler : 1,
    },
    velocity : 1,
}

/*
    Electron
*/
Electron = function(scene) { // constructor
    // attach base object (the view), and add the object to the scene
    this.base_object = new ParticleSystem(scene);

    // define initial position
    this.position  = {
        x : 0,
        y : 0,
        z : 0,
    }

    // define initial velocity
    this.velocity = {
        x : 0,
        y : 0,
        z : 0,
    }

    // define initial velocity_certainty
    this.velocity.certainty = 1;

    // define our confididence in its position;
    this.scale = this.calculate_uncertainty.position(this.velocity.certainty, this.calculate_time_out_of_trap());

    // define if motion should be updated
    this.moving = false;

    // reference parent object for calculate_uncertainty object
    this.calculate_uncertainty.parent = this;

    // launch time
    this.leave_time = null;
};

Electron.prototype = {
    /*
        convinience handlers
    */
    get radius(){ return this.scale; }, // scale = radius

    /*
        play mechanics
    */
    set in_trap(status){ // setter, called by game_manager
        var prior_status = this.bool_in_trap;
        if(prior_status == true && status == false) this.leave_time = new Date(); // just left
        if(prior_status == false && status == true) this.leave_time = null; // just got back
        if(prior_status != this.bool_in_trap) this.bool_in_trap = status; // update status
    },
    get in_trap(){ return this.bool_in_trap },
    update : function(){
        if(this.moving){
            this.obey_uncertainty_principle();
            this.move(); // move
        }
    },
    launch : function(direction, magnitude, certainty){
        // velocity =  direction vector * launch magnitude
        this.velocity.x = direction.x * magnitude;
        this.velocity.y = direction.y * magnitude;
        this.velocity.z = direction.z * magnitude;

        // velocity.certainty = certainty
        this.velocity.certainty = certainty; // a float from 0 to 1

        // set that its moving
        this.moving = true;
    },
    move : function(){ // update position of electron based on velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.velocity.z;
        this.update_position();
    },
    obey_uncertainty_principle : function(){ // update position (i.e., scale) and velocity based on uncertainty principle
        // retreive measurements required for further calculations
        var uncertainty_in_velocity = this.calculate_uncertainty.velocity(this.velocity.certainty);
        var time_out_of_trap = this.calculate_time_out_of_trap();

        // update uncertainty in position; function of (time, certainty.velocity)
        this.scale = this.calculate_uncertainty.position(uncertainty_in_velocity, time_out_of_trap);
        console.log(this.scale);
        this.update_scale();

        // update uncertainty in velocity; function of (time, certainty.velocity)
        if(this.velocity.x != 0) this.velocity.x += this.calculate_uncertainty.effect_on_velocity(uncertainty_in_velocity);
        if(this.velocity.y != 0) this.velocity.y += this.calculate_uncertainty.effect_on_velocity(uncertainty_in_velocity);
        if(this.velocity.z != 0) this.velocity.z += this.calculate_uncertainty.effect_on_velocity(uncertainty_in_velocity);
    },
    check_existance : function(){ // if electron position becomes too uncertain, we can "no longer track it", and user looses
        if(this.scale > this.scale_threshold){
            this.launched = false;
            this.isVisible = false;
        }
    },

    /*
        particle system updaters
    */
    update_position : function(position){
        this.base_object.update_position(this.position);
    },
    update_scale : function(){
        this.base_object.update_scale(this.scale);
    },

    /*
        Uncertainty Principle Calculations
    */
    calculate_time_out_of_trap : function(){
        if(this.leave_time == null) return 0; // if leave time not set, its still in trap, return 0
        return new Date() - this.leave_time; // if leave time is set, return differnce in time
    },
    calculate_uncertainty : {
        position : function(uncertainty_in_velocity, time_out_of_trap){
            /*
                the uncertainty in position is affected by two things
                    1. the more specificly we know velocity, the less specificly we know velocity (specific = certain)
                    2. when particle is not bound (wave packet, its energy > 0), its position distribution spreads out
                        - see "gaussian wave packet" constant momentum section : https://en.wikipedia.org/wiki/Uncertainty_principle#Constant Momentum
                        - that means:
                            - if we are not in an "electron trap" the position uncertainty increases (electron trap -> e.g., potential well, harmonic oscilator, etc)
        MATH ->                  - proportional to sqrt(1 + w_0**2 * t**2) / uncertainty_in_velocity
                                    - omega is some constant we can play with to scale it to our dimensions
                            - if we are in an "electron trap", position uncertainty decreases (for our purposes, we'll just say it becomes zero again)
            */
            var uncertainty = Math.sqrt(1 + Math.pow(uncertainty_constant.position.time_weight, 2) * Math.pow(time_out_of_trap, 2)) / uncertainty_in_velocity;
            var scaled_uncertainty = uncertainty * uncertainty_constant.position.scaler;
            return scaled_uncertainty;
        },
        velocity : function(certainty){
            /*
                the uncertainty in velocity is govered by, in our game, how specific the user wanted to be when launching the object
                in reality uncertainty in position and volatility are intertwined,
                    but its simpler mechanics if we treat position mathematically
                    and treat velocity as something based off of the user - for gameplay sake
            */
            var uncertainty = 1 - certainty;
            var scaled_uncertainty = uncertainty * uncertainty_constant.velocity;
            return scaled_uncertainty;
        },
        effect_on_velocity : function(uncertainty_in_velocity){ // based on how specific the user wanted velocity to be, update the velocity
            /*
                generate random change in velocity_certainty based on certainty
                      define range as [-certainty/2, certainty/2]
                      the result is that each component of velocity varies by a magnitude proportional to how specific the user wanted to be with velocity
            */

            // convert uncertainty into delta in velocity
            var uncertainty_magnitude = uncertainty_in_velocity;
            var half_magnitude = uncertainty_magnitude/2;
            var min = -1*half_magnitude;
            var max = half_magnitude
            var random_delta = Math.random() * (max - min) + min; // get random number between min and max

            // return change
            return random_delta;
        },
    },
}

// TODO
// 1. probabilistic collisions (includes tunneling)
// 2. coulomb forces


// export the asset
module.exports = Electron;
