var BABYLON = window.require_global.BABYLON;
var root_document = window.require_global.document;
var view_loader = require("clientside-view-loader");
var promise_aiming_ui = view_loader.load("/src/displays/aiming_ui").generate()

var Aimer = function(scene){
    this.promise_arrow = BABYLON.SceneLoader.ImportMeshAsync(null, "/src/_static_resources/objects/", "arrow.obj", scene)
        .then((result)=>{
            var meshes = result.meshes;
            return meshes[0];
        })
        .then((arrow)=>{
            this.arrow = arrow;
            this.arrow.isVisible = false; // hide it by default
        })
    this.promise_aiming_ui = promise_aiming_ui
        .then((dom)=>{
            this.aiming_ui = dom;
            root_document.querySelector("html").appendChild(dom); // attach the ui to the root document
        })
    this.move = {
        left: false,
        right: false,
    };
    this.inertia = 0;
    this.pivot = null;


    // initialize key listeners
    BABYLON.Tools.RegisterTopRootEvents([
        { name: "keydown", handler: this.on_keydown.bind(this), },
        { name: "keyup", handler: this.on_keyup.bind(this), },
    ]);
    this.key_listening = false; // toggles key listeners - rather than removing them from blender
}
Aimer.prototype = {
    get_position : function(){
        var bab_pos = this.arrow.getBoundingInfo().boundingBox.centerWorld;
        return {x: bab_pos.x, y:bab_pos.y, z:bab_pos.z};
    },
    show : async function(){
        await this.promise_arrow;
        await this.promise_aiming_ui;
        this.arrow.isVisible = true;
        this.aiming_ui.show();
    },
    hide : async function(){
        await this.promise_arrow;
        this.arrow.isVisible = false;
        this.aiming_ui.hide();
    },
    position : async function(position) {
        await this.promise_arrow;
        this.arrow.position = position;
    },
    initialize : async function(electron){
        await this.promise_arrow;
        // define radius to be a little bigger than the electron radius
        console.log(electron.radius);
        this.radius = electron.radius + 1;

        // rotate so that the arrow is pointig out when at x axis offset
        this.arrow.rotation.z = Math.PI*3/2;

        // create a pivot at electron position, rotate the pivot to rotate the aimer around the pivot
        this.pivot = new BABYLON.TransformNode("root");
        this.pivot.position = electron.position;
        this.arrow.parent = this.pivot;

        // adjust position relative to parent
        this.arrow.position = {
            x : this.radius,
            y : 0,
            z : 0,
        }

        // enable key listeners
        this.key_listening = true;

        // display
        this.show();
    },
    remove : async function(){
        await this.promise_arrow;

        // remove key listeners
        this.key_listening = false;

        // set pivot to null
        this.pivot = null;

        // set parent = null
        this.arrow.parent = null;

        // hide
        await this.hide();
    },
    on_keydown : function(event){
        if(!this.key_listening) return; // skip if not listening
        /*
            left arrow	37
            up arrow	38
            right arrow	39
            down arrow	40
            w           87
            a           65
            s           83
            d           68
        */
        var angle_magnitude = 0.05; // TODO - make rotation accelleration for increasing angle
        if(event.keyCode == 37 || event.keyCode == 65){ // left or a
            this.move.left = true;
        }
        if(event.keyCode == 39 || event.keyCode == 68){ // right or d
            this.move.right = true;
        }
        if(event.keyCode == 38){ // up
            this.aiming_ui.update.magnitude_delta(1);
        }
        if(event.keyCode == 40){ // down
            this.aiming_ui.update.magnitude_delta(-1);
        }
        if(event.keyCode == 87){ // w
            this.aiming_ui.update.certainty_delta(1);
        }
        if(event.keyCode == 83){ // s
            this.aiming_ui.update.certainty_delta(-1);
        }
    },
    on_keyup : function(event){
        if(!this.key_listening) return; // skip if not listening
        if(event.keyCode == 37 || event.keyCode == 65){
            this.move.left = false;
        }
        if(event.keyCode == 39 || event.keyCode == 68){
            this.move.right = false;
        }
        if(!this.move.left && !this.move.right) this.inertia = 0;
    },
    update : function(){
        if(this.pivot == null) return; // if pivot is null, nothing to update; we've been detached
        /*
            rotate if requested
        */
        if(this.move.left || this.move.right){
            var inertial_contribution = 0.00025 * Math.pow(this.inertia, 2);
            var angle_magnitude = 0.025 + inertial_contribution; // inertia provides acceleration to rotation
            this.inertia += 1;
            if(this.move.left && this.move.right) this.inertia = 0;
            var right_angle = (this.move.right)? angle_magnitude : 0;
            var left_angle = (this.move.left)? angle_magnitude * (-1) : 0;
            var final_angle = left_angle + right_angle;
            this.pivot.rotate(BABYLON.Axis.Z, final_angle, BABYLON.Space.WORLD);
        }
    },
    get_direction : function(){
        var current_position = this.get_position();
        var electron_position = this.pivot.position;
        var position_difference = {
            x: current_position.x - electron_position.x,
            y: current_position.y - electron_position.y,
            z: current_position.z - electron_position.z,
        }
        return position_difference;
    },
    get_aim : function(){
        var vel_and_mag = this.aiming_ui.extract();
        var direction = this.get_direction();
        var certainty = vel_and_mag.certainty / 10; // scale to 0-1
        var magnitude = vel_and_mag.magnitude / 10; // scale to 0-1
        return {
            direction : direction,
            certainty : certainty,
            magnitude : magnitude,
        }
    },
}

module.exports = Aimer;
