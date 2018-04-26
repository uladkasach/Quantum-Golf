// https://www.babylonjs-playground.com/#TUNZFH

module.exports = function (BABYLON, engine, canvas) {
    var scene = new BABYLON.Scene(engine);

    // Setup environment
    var light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 2, 8), scene);
    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 20, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("/src/_static_resources/textures/flare.png", scene);

    // fine tuning
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1;
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 1;

    // Where the particles come from
    particleSystem.emitter = new BABYLON.Vector3(0, 0, 0); // the starting object, the emitter
    var sphereEmitter = particleSystem.createSphereEmitter(1.2);

    // particle creation
    particleSystem.emitRate = 500;

    // Start the particle system
    particleSystem.start();

    return scene;
}
