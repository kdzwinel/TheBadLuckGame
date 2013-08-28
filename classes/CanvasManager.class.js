(function(global, undefined) {
	"use strict";

	global.CanvasManager = function(){
		var canvas,
			context,
			managers;

		function init() {
			var htmlBoard  = document.getElementById('board');

			canvas     	  = document.getElementById('canvas');
			canvas.width  = htmlBoard.clientWidth;
			canvas.height = htmlBoard.clientHeight;

			context = canvas.getContext('2d');
			managers = [];
		}

		this.addManager = function(manager, priority) {
			if(priority  === undefined) {
				managers.push(manager)
			} else {
				managers.splice(priority, 0, manager);
			}
		}

		this.animate = function() {
			context.clearRect(0, 0, canvas.width, canvas.height);
			
			while(managers[--i]) {
				managers[i].render(context);
			}
			
			global.requestAnimationFrame(animate);
		};

		init();
		
	}
})(window)