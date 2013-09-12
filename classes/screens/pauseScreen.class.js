(function () {
	"use strict";

	window.PauseScreen = function (options) {
		var listenersMgr,
			pausedScreen,
			resumeButton,
			levelsButton;

		function init() {
			listenersMgr = new EventListenersManager(['resume-game', 'back-to-levels']);

			pausedScreen = options.element;
			resumeButton = pausedScreen.querySelector('#resume-button');
			levelsButton = pausedScreen.querySelector('#levels-button');

			new Tap(resumeButton);
			new Tap(levelsButton);

			resumeButton.addEventListener('tap', function(e) {
				hide();
				listenersMgr.trigger('resume-game');
			}, false);

			levelsButton.addEventListener('tap', function(e) {
				hide();
				listenersMgr.trigger('back-to-levels');
			}, false);

		}
		init();

		function hide() {
			pausedScreen.style.display = 'none';
		}

		this.show = function() {
			pausedScreen.style.display = 'block';
		}


		this.on = function (event, callback) {
			listenersMgr.addEventListener(event, callback);
		};

		this.destroy = function() {
			DOMHelper.unbindAllEvents(resumeButton);
			DOMHelper.unbindAllEvents(levelsButton);
			listenersMgr.removeEventListener();
			listenersMgr = pausedScreen =  resumeButton = levelsButton = undefined;
		}
	}
})()