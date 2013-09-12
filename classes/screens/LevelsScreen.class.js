(function() {
	"use strict";

	window.LevelsScreen = function(options) {
		var listenersMgr,
			isVisible = false;

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

			initLevels();
		}
		init();

		function initLevels() {
			var i, l, levels = options.element.querySelectorAll('.levels li');

			for(i=0, l=levels.length; i<l; i++) {
				var levelName = levels[i].dataset.levelName,
					levelInfo = options.progressManager.getLevelInfo(levelName);

				updateLevelNode(levels[i], levelInfo);
			}

			unlockNextLevel();

			options.progressManager.on('level-update', function(data) {
				for(i=0, l=levels.length; i<l; i++) {
					var levelName = levels[i].dataset.levelName;

					if(levelName === data.levelName) {
						updateLevelNode(levels[i], data);
					}
				}
			});

			options.progressManager.on('level-unlock', unlockNextLevel);
		}

		function unlockNextLevel() {
			var levelNode = options.element.querySelector('.levels li.inactive');

			if(levelNode) {
				levelNode.classList.remove('inactive');
			}
		}

		function updateLevelNode(node, data) {
			if(!data) {
				node.classList.add('inactive');
			} else {
				node.classList.remove('inactive');

				var starNodes = node.querySelectorAll('.star');

				for(var i=0; i<3; i++) {
					if(data.stars < (i+1)) {
						starNodes[i].classList.add('inactive');
					} else {
						starNodes[i].classList.remove('inactive');
					}
				}
			}
		}

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
		};

		this.beforeHide = function() {
			isVisible = false;
		};

		this.afterHide = function() {

		};
	}
})();