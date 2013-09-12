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
					domNode.removeEventListener('webkitTransitionEnd', callback);
					domNode.removeEventListener('transitionEnd', callback);
					domNode.removeEventListener('transitionend', callback);

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

					domNode.removeEventListener('webkitTransitionEnd', callback);
					domNode.removeEventListener('transitionEnd', callback);
					domNode.removeEventListener('transitionend', callback);

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
				throw "Screen '" + name + "' doesn't exist.";
			}

			if(visibleScreen) {
				if(screen.beforeHide){
					screen.beforeHide();
				}

				var afterHide = createAfterHideCallback(visibleScreen);
				visibleScreen.getDOMNode().addEventListener('webkitTransitionEnd', afterHide);
				visibleScreen.getDOMNode().addEventListener('transitionEnd', afterHide);
				visibleScreen.getDOMNode().addEventListener('transitionend', afterHide);

				visibleScreen.getDOMNode().classList.remove('visible');
			}

			screen.getDOMNode().style.visibility = 'visible';
			if(screen.beforeShow){
				screen.beforeShow(data);
			}

			var afterShow = createAfterShowCallback(screen, data);
			screen.getDOMNode().addEventListener('webkitTransitionEnd', afterShow);
			screen.getDOMNode().addEventListener('transitionEnd', afterShow);
			screen.getDOMNode().addEventListener('transitionend', afterShow);

			screen.getDOMNode().classList.add('visible');

			visibleScreen = screen;
		};
	}
})();