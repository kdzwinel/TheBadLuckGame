(function() {
	"use strict";

	window.ScreenManager = function() {
		var screens = {},
			visibleScreen = null;

		this.addScreen = function(screen, name) {
			screens[name] = screen;
		};

		this.goToScreen = function(name, data) {
			var screen = screens[name];

			if(!screen) {
				throw "Screen '" + name + "' doesn't exist.";
			}

			if(visibleScreen) {
				visibleScreen.beforeHide();
				visibleScreen.getDOMNode().classList.remove('visible');
				visibleScreen.afterHide();
			}

			screen.beforeShow(data);
			screen.getDOMNode().classList.add('visible');
			screen.afterShow(data);

			visibleScreen = screen;
		};
	}
})();