(function () {
	"use strict";

	window.IntroScreen = function (options) {
		var listenersMgr;

		function init() {
			listenersMgr = new EventListenersManager(['start']);

			var playButton = options.element.querySelector('#play-button');
			new Tap(playButton);
			playButton.addEventListener('tap', function () {
				listenersMgr.trigger('start');
			}, false);
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