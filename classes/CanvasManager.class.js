(function (global, undefined) {
	"use strict";

	global.CanvasManager = function (options) {
		var canvas,
			tileSize,
			context,
			managers,
			active;

		function init() {
			canvas = options.element;
			tileSize = 154;
			canvas.width = options.tilesHorizontal * tileSize;
			canvas.height = options.tilesVertical * tileSize;
			context = canvas.getContext('2d');
			managers = [];
		}

		function animate() {
			if(!active) {
				return;
			}

			var i = managers.length;

			context.clearRect(0, 0, canvas.width, canvas.height);
			while (i) {
				managers[--i].render(context, tileSize);
			}

			global.requestAnimationFrame(animate);
		}

		this.addManager = function (manager, priority) {
			if (priority === undefined) {
				managers.push(manager)
			} else {
				managers.splice(priority, 0, manager);
			}
		};

		this.startAnimation = function () {
			active = true;
			animate();
		};

		this.stopAnimation = function () {
			active = false;
		}

		this.getWidth = function () {
			return canvas.width;
		};

		this.getHeight = function () {
			return canvas.height;
		};

		this.getTileSize = function () {
			return tileSize;
		};

		this.destroy = function() {
			active = false;
			canvas = null;
			context = null;
			managers = null;
		};

		init();

	}
})(window);
