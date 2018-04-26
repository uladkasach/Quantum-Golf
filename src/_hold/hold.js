
Electron.prototype.on = {
    keydown : function(event){
        if (event.keyCode == 32 && !this.launched){ // if space, attempt to launch
            this.launch();
        }
    },
};
