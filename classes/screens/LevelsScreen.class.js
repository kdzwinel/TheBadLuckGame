(function() {
	"use strict";

	window.LevelsScreen = function(options) {
		var listenersMgr,
			isVisible = false,
			emitInterval, canvas, context, screenWidth, screenHeight, emitter;

		function getParentByTagName(obj, tag)
		{
			var parent = obj.parentNode;
			if (!parent) {
				return false;
			}

			return (parent.tagName.toLowerCase() == tag) ? parent : getParentByTagName(parent, tag);
		}

		function init() {
			listenersMgr = new EventListenersManager(['level-chosen']);

			var levels = options.element.querySelector('.levels');
			levels.onclick = function(e) {
				var li = getParentByTagName(e.target, 'li');

				if (li) {
					listenersMgr.trigger('level-chosen', {
						levelName: li.dataset.levelName
					});
				}
			};

			/* Init Emitter */
			var image = document.createElement('img');
			canvas = options.element.querySelector('.particles');
			context = canvas.getContext('2d');
			screenWidth = 1200;
			screenHeight = 800;
			emitter = new jEmitter.ParticleEmitter({
				spreadX : 0,
				spreadY : 800,
				minVelocity : 0.5,
				maxVelocity : 0.5,
				minGravity :  0,
				maxGravity : 0,
				minWind	   : 1,
				maxWind	   : 1,
				minSize    : 5,
				maxSize    : 45,
				maxParticleEmit : 4,
				minParticleEmit : 1,
				minAlpha: 50,
				maxAlpha: 50,
				minRotateStep : -1,
				maxRotateStep : 1,

				image : image
			});

			canvas.width = screenWidth;
			canvas.height = screenHeight;
			context.globalCompositeOperation = 'lighter';
			image.src = 'gfx/level-label.png';
		}
		init();

		/**
		 * Allows to listen for various in-game events.
		 * @param {string} event
		 * @param {function} callback
		 */
		this.on = function (event, callback) {
			listenersMgr.addEventListener(event, callback);
		};

		this.getDOMNode = function() {
			return options.element;
		};

		this.beforeShow = function() {
			isVisible = true;

			var animate = function () {
				context.clearRect(0, 0, screenWidth, screenHeight);
				emitter.render(context);

				if (isVisible) {
					window.requestAnimationFrame(animate);
				}
			};
			animate();

			emitInterval = setInterval(function () {
				emitter.emit(-10, screenHeight/2);
			}, 100);
		};

		this.afterShow = function() {

		};

		this.beforeHide = function() {

		};

		this.afterHide = function() {
			clearInterval(emitInterval);
			isVisible = false;
		};
	}
})();