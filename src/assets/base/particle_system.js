var BABYLON = window.require_global.BABYLON;

var ParticleSystem = function(scene){
    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    // assign the particle system to this object
    this.base_object = particleSystem;

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("/src/_static_resources/textures/flare.png", scene);


    // lifespan and size of particles
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1;
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 1;

    // start particle emission
    particleSystem.emitRate = 500;

    // Where the particles come from
    this.update_position({x:0, y:0, z:0})

    // shape of particle
    this.update_scale(1);

    // Start the particle system
    this.show();
}
ParticleSystem.prototype = {
    update_position : function(position){
        // use the emitter to update where the particle system is
        this.base_object.emitter = new BABYLON.Vector3(position.x, position.y, position.z);
    },
    update_scale : function(scale){
        this.base_object.createSphereEmitter(scale); // update the scale of the sphere emitter, overwrite previous one
    },
    hide : function(){
        this.base_object.stop(); // hide by setting emit rate = 0
    },
    show : function(){
        this.base_object.start(); // show by setting emit rate not zero
    }
}
module.exports = ParticleSystem;
