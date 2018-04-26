// TODO - remove duplicate code (like geting values and deltas)

module.exports = {
    generate : function(dom, options){
        dom.hide = function(){
            this.style.display = "none";
        }
        dom.show = function(){
            this.style.display = "flex";
        }
        dom.update = {
            magnitude : function(magnitude){
                dom.querySelector("#magnitude").innerHTML = magnitude;
            },
            certainty : function(certainty){
                dom.querySelector("#certainty").innerHTML = certainty;
            },
            certainty_delta : function(delta){
                var certainty = parseInt(dom.querySelector("#certainty").innerHTML);
                certainty = certainty + delta;
                if(certainty > 10) certainty = 10;
                if(certainty < 0) certainty = 0;
                this.certainty(certainty); // update velocity
            },
            magnitude_delta : function(delta){
                var magnitude = parseInt(dom.querySelector("#magnitude").innerHTML);
                magnitude = magnitude + delta;
                if(magnitude > 10) magnitude = 10;
                if(magnitude < 0) magnitude = 0;
                this.magnitude(magnitude); // update magnitude
            }
        }
        dom.extract = function(){
            var magnitude = parseInt(dom.querySelector("#magnitude").innerHTML);
            var certainty = parseInt(dom.querySelector("#certainty").innerHTML);
            return {certainty : certainty, magnitude : magnitude};
        }
        return dom;
    }
}
