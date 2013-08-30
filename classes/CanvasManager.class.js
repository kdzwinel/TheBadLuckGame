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

		function animate() {
			var i = managers.length;
			
			context.clearRect(0, 0, canvas.width, canvas.height);
			while(i) {
				managers[--i].render(context);
			}
			
			global.requestAnimationFrame(animate);
		};

		this.addManager = function(manager, priority) {
			if(priority  === undefined) {
				managers.push(manager)
			} else {
				managers.splice(priority, 0, manager);
			}
		}

		this.startAnimation = function(){
			animate();
		}

		this.getWidth = function() {
			return canvas.width;
		}

		this.getHeight = function() {
			return canvas.height;
		}

		init();
		
	}
})(window)