(function () {
	"use strict";

	window.EndScreen = function (options) {
		var listenersMgr,
			endScreen,
			winSubScreen,
			looseSubScreen,
			winLevelsButton,
			looseLevelsButton;

		function init() {
			listenersMgr = new EventListenersManager(['back-to-levels']);

			endScreen = options.element;
			winSubScreen = endScreen.querySelector(('#win'));
			looseSubScreen = endScreen.querySelector(('#loose'));

			winLevelsButton   = endScreen.querySelector('#win-levels-button');
			looseLevelsButton = endScreen.querySelector('#loose-levels-button');

			new Tap(winLevelsButton);
			new Tap(looseLevelsButton);


			looseLevelsButton.addEventListener('tap', function(e) {
				hideLoose();
				listenersMgr.trigger('back-to-levels');
			}, false);

			winLevelsButton.addEventListener('tap', function(e) {
				hideWin();
				listenersMgr.trigger('back-to-levels');
			}, false);

		}
		init();



		function hideWin() {
			endScreen.style.display = 'none';
			winSubScreen.style.display = 'none';
		}

		function hideLoose() {
			endScreen.style.display = 'none';
			looseSubScreen.style.display = 'none';

		}

		this.showWin = function() {
			endScreen.style.display = 'block';
			winSubScreen.style.display = 'block';
		}

		this.showLoose = function() {
			endScreen.style.display = 'block';
			looseSubScreen.style.display = 'block';
		}

		this.on = function (event, callback) {
			listenersMgr.addEventListener(event, callback);
		};

		this.destroy = function() {
			DOMHelper.unbindAllEvents(winLevelsButton);
			DOMHelper.unbindAllEvents(looseLevelsButton);
			listenersMgr.removeEventListener();
			listenersMgr = endScreen = winSubScreen = looseSubScreen = winLevelsButton = looseLevelsButton = undefined;
		}
	}
})()