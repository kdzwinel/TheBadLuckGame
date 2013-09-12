(function() {
	"use strict";

	window.LevelsScreen = function(options) {
		var listenersMgr,
			isVisible = false,
			emitInterval, canvas, context, screenWidth, screenHeight, emitter;

		function init() {
			listenersMgr = new EventListenersManager(['level-chosen']);

			var levels = options.element.querySelector('.levels');
			new Tap(levels);
			levels.addEventListener('tap', function(e) {
				var li = DOMHelper.getParentByTagName(e.target, 'li');

				if (li && !li.classList.contains('inactive')) {
					listenersMgr.trigger('level-chosen', {
						levelName: li.dataset.levelName
					});
				}
			}, false);

			/* Init Emitter */
			var image = document.createElement('img');
			canvas = options.element.querySelector('.particles');
			context = canvas.getContext('2d');
			screenWidth = window.innerWidth;
			screenHeight = window.innerHeight;
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

				images : [image]
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

		};

		this.afterShow = function() {
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

		this.beforeHide = function() {
			clearInterval(emitInterval);
			isVisible = false;
		};

		this.afterHide = function() {

		};
	}
})();