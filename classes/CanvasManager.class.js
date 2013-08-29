(function(global, undefined) {
	"use strict";

	global.CanvasManager = function(options){
		var canvas,
			context,
			managers;

		function init() {
			canvas     	  = options.element;
			canvas.width  = options.width;
			canvas.height = options.height;

			context = canvas.getContext('2d');
			managers = [];
		}

		this.addManager = function(manager, priority) {
			if(priority  === undefined) {
				managers.push(manager)
			} else {
				managers.splice(priority, 0, manager);
			}
		};

		this.animate = function() {
			context.clearRect(0, 0, canvas.width, canvas.height);
			
			while(managers[--i]) {
				managers[i].render(context);
			}
			
			global.requestAnimationFrame(animate);
		};

		init();
		
	}
})(window);