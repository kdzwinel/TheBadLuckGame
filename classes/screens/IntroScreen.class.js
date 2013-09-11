(function () {
	"use strict";

	window.IntroScreen = function (options) {
		var listenersMgr,
			loader,
			isVisible = false,
			emitInterval, canvas, context, screenWidth, screenHeight, emitter;

		function init() {
			listenersMgr = new EventListenersManager(['start']);

			var playButton = options.element.querySelector('#play-button');
			new Tap(playButton);
			playButton.addEventListener('tap', function () {
				listenersMgr.trigger('start');
			}, false);

			/* Init Loader */
			var loader = options.element.querySelector('#loader');
			if(options.loader.getPercentage() === 100) {
				loader.classList.add('hidden');
				playButton.classList.remove('hidden');
			} else {
				options.loader.on('load', function(percentage) {
					loader.querySelector('span').innerHTML = percentage + '%';
					loader.querySelector('.bar').style.width = percentage + '%';

					if(percentage === 100) {
						loader.classList.add('hidden');
						playButton.classList.remove('hidden');
					}
				});
			}

			/* Init Emitter */
			canvas = options.element.querySelector('.particles');
			context = canvas.getContext('2d');
			screenWidth = window.innerWidth;
			screenHeight = window.innerHeight;
			emitter = new jEmitter.ParticleEmitter({
				poolSize: 500,
				spreadX: 400,
				spreadY: 0,
				minVelocity: 0.5,
				maxVelocity: 0.5,
				minGravity: 0,
				maxGravity: 0,
				minWind: 0,
				maxWind: 0,
				minSize: 10,
				maxSize: 30,
				minSizeStep: -2,
				maxSizeStep: -4,
				maxParticleEmit: 5,
				minParticleEmit: 1,
				minAlpha: 100,
				maxAlpha: 100,
				minVelocityRadius: 50,
				maxVelocityRadius: 130,
				colors: ["#000000"]
			});

			canvas.width = screenWidth;
			canvas.height = screenHeight;
			context.globalCompositeOperation = 'lighter';
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

		this.getDOMNode = function () {
			return options.element;
		};

		this.beforeShow = function () {

		};

		this.afterShow = function () {
			isVisible = true;

			var animate = function () {
				if (isVisible) {
					context.clearRect(0, 0, screenWidth, screenHeight);
					emitter.render(context);

					window.requestAnimationFrame(animate);
				}
			};
			animate();

			emitInterval = setInterval(function () {
				emitter.emit(screenWidth / 2, screenHeight);
			}, 100);
		};

		this.beforeHide = function () {
			clearInterval(emitInterval);
			emitInterval = null;
			isVisible = false;
		};

		this.afterHide = function () {
			canvas = null;
			context = null;
			emitter = null;
			options.element.innerHTML = '';
		};
	}
})();