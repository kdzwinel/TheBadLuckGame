(function() {
	"use strict";

	window.MainScreen = function(options) {
		var listenersMgr;

		function init() {
			listenersMgr = new EventListenersManager(['level-chosen']);

			var levels = options.element.querySelector('.levels');
			levels.onclick = function(e) {
				if(e.target.nodeName !== 'LI') {
					return;
				}

				listenersMgr.trigger('level-chosen', {
					levelName: e.target.dataset.levelName
				});
			};
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

		};

		this.beforeHide = function() {

		};

		this.afterHide = function() {

		};
	}
})();