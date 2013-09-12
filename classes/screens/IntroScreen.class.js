(function () {
	"use strict";

	window.IntroScreen = function (options) {
		var listenersMgr,
			loader;

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

		this.afterHide = function () {
			DOMHelper.purgeElement(options.element);
		};
	}
})();