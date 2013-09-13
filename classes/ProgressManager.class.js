(function() {
	"use strict";

	window.ProgressManager = function() {
		var listenersMgr,
			levels = {};

		function init() {
			listenersMgr = new EventListenersManager([
				'level-update',
				'level-unlock'
			]);

			load();
		}
		init();

		function load() {
			var gameProgress;

			if(localStorage.gameProgress) {
				try {
					gameProgress = JSON.parse(localStorage.gameProgress);
				} catch(e) {
					throw "Error parsing.";
				}
			}

			if(gameProgress && gameProgress.levels) {
				levels = gameProgress.levels;
			}
		}

		function save() {
			localStorage.gameProgress = JSON.stringify({
				levels: levels
			});
		}

		this.getLevelInfo = function(levelName) {
			return levels[levelName];
		};

		this.update = function(data) {
			if(levels[data.levelName] && levels[data.levelName].score > data.score) {
				//if not a new high score
				return;
			} else if(!levels[data.levelName]) {
				//new level unlocked
				listenersMgr.trigger('level-unlock');
			}

			levels[data.levelName] = {
				score: data.score,
				stars: data.stars
			};

			listenersMgr.trigger('level-update', data);
			save();
		};

		/**
		 * Allows to listen point changes (level-update) and level unlocking (level-unlock)
		 * @param {string} event
		 * @param {function} callback
		 */
		this.on = function (event, callback) {
			listenersMgr.addEventListener(event, callback);
		};
	};
})();