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

};

Electron.prototype = {
    /*
        convinience handlers
    */
    get radius(){ return this.scale; }, // scale = radius

    /*
        play mechanics
    */
    calculate_time_out_of_trap : function(){
        // TODO - upon detecting that we leave a trap, a timestamp should be set in object defining when we left it
        // this function should determine how long ago we left it in seconds
        return 0;
    },
    launch : function(direction, magnitude, certainty){
        // velocity =  direction vector * launch magnitude
        this.velocity.x = direction.x * magnitude;
        this.velocity.y = direction.y * magnitude;
        this.velocity.z = direction.z * magnitude;

        // velocity.certainty = certainty
        this.velocity.certainty = certainty; // a float from 0 to 1
    },
    obey_uncertainty_principle : function(){ // update position (i.e., scale) and velocity based on uncertainty principle
        // update uncertainty in position; function of (time, certainty.velocity)
        this.scale = this.calculate_uncertainty.position();
        this.update_scale();

        // update uncertainty in velocity; function of (time, certainty.velocity)
        this.velocity.x += this.calculate_uncertainty.effect_on_velocity();
        this.velocity.y += this.calculate_uncertainty.effect_on_velocity();
        this.velocity.z += this.calculate_uncertainty.effect_on_velocity();
    },
    move : function(){ // update position of electron based on velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.velocity.z;
        this.update_position();
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
        this.base_object.update_position(position);
    },
    update_scale : function(scale){
        this.base_object.update_scale(scale);
    },

    /*
        Uncertainty Principle Calculations
    */
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
        velocity : function(){
            /*
                the uncertainty in velocity is govered by, in our game, how specific the user wanted to be when launching the object
                in reality uncertainty in position and volatility are intertwined,
                    but its simpler mechanics if we treat position mathematically
                    and treat velocity as something based off of the user - for gameplay sake
            */
            var certainty = this.certainty;
            var uncertainty = 1 - certainty;
            var scaled_uncertainty = uncertainty * uncertainty_constant.velocity;
            return scaled_uncertainty;
        },
        effect_on_velocity : function(){ // based on how specific the user wanted velocity to be, update the velocity
            /*
                generate random change in velocity_certainty based on certainty
                      define range as [-certainty/2, certainty/2]
                      the result is that each component of velocity varies by a magnitude proportional to how specific the user wanted to be with velocity
            */

            // convert uncertainty into delta in velocity
            var uncertainty_magnitude = this.calculate_uncertainty.velocity;
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
