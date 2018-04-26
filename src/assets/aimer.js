var BABYLON = window.require_global.BABYLON;

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
    this.move = {
        left: false,
        right: false,
    };
    this.inertia = 0;
    this.pivot = null;
}
Aimer.prototype = {
    show : async function(){
        await this.promise_arrow;
        this.arrow.isVisible = true;
        console.log("here i am!");
    },
    hide : async function(){
        await this.promise_arrow;
        this.arrow.isVisible = false;
    },
    position : async function(position) {
        await this.promise_arrow;
        this.arrow.position = position;
    },
    initialize : async function(electron){
        await this.promise_arrow;
        // define radius to be twise the electron radius
        this.radius = electron.radius * 2;
        console.log(this.radius);

        // set the arrow radius away on x axis
        this.arrow.position = {
            x : electron.position.x + this.radius,
            y : electron.position.y,
            z : electron.position.z,
        }
        console.log(this.arrow.position);

        // rotate so that the arrow is pointig out when at x axis offset
        this.arrow.rotation.z = Math.PI*3/2;

        // create a pivot at electron position, rotate the pivot to rotate the aimer around the pivot
        this.pivot = new BABYLON.TransformNode("root");
        this.pivot.position = electron.position;
        this.arrow.parent = this.pivot;

        // assign key listeners
        BABYLON.Tools.RegisterTopRootEvents([
            { name: "keydown", handler: this.on_keydown.bind(this), },
            { name: "keyup", handler: this.on_keyup.bind(this), },
        ]);

        // display
        this.show();
    },
    remove : async function(){
        await this.promise_arrow;

        // remove key listeners

        // set pivot to null
        this.pivot = null;

        // hide
        await this.hide();
    },
    on_keydown : function(event){
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
        if(event.keyCode == 37 || event.keyCode == 65){
            this.move.left = true;
        }
        if(event.keyCode == 39 || event.keyCode == 68){
            this.move.right = true;
        }
    },
    on_keyup : function(event){
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
    }
}

module.exports = Aimer;
