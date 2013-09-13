(function() {
	"use strict";

	window.ScreenManager = function() {
		var screens = {},
			visibleScreen = null;

		function createAfterHideCallback(oldScreen) {
			var callback =  function(e) {
				if(e.target === e.currentTarget) {
					var domNode = oldScreen.getDOMNode();

					domNode.style.visibility = 'hidden';
					domNode.removeEventListener(DOMHelper.transitionEnd, callback);

					if(oldScreen.afterHide){
						oldScreen.afterHide();
					}
				}
			};

			return callback;
		}

		function createAfterShowCallback(newScreen, data) {
			var callback =  function(e) {
				if(e.target === e.currentTarget) {
					var domNode = newScreen.getDOMNode();

					domNode.removeEventListener(DOMHelper.transitionEnd, callback);

					if(newScreen.afterShow){
						newScreen.afterShow(data);
					}
				}
			};

			return callback;
		}

		this.addScreen = function(screen, name) {
			screens[name] = screen;
			screen.getDOMNode().style.visibility = 'hidden';
		};

		this.goToScreen = function(name, data) {
			var screen = screens[name];

			if(!screen) {
				throw "Screen invalid.";
			}

			if(visibleScreen) {
				if(screen.beforeHide){
					screen.beforeHide();
				}

				var afterHide = createAfterHideCallback(visibleScreen);
				visibleScreen.getDOMNode().addEventListener(DOMHelper.transitionEnd, afterHide);

				visibleScreen.getDOMNode().classList.remove('visible');
			}

			screen.getDOMNode().style.visibility = 'visible';
			if(screen.beforeShow){
				screen.beforeShow(data);
			}

			var afterShow = createAfterShowCallback(screen, data);
			screen.getDOMNode().addEventListener(DOMHelper.transitionEnd, afterShow);

			screen.getDOMNode().classList.add('visible');

			visibleScreen = screen;
		};
	}
})();