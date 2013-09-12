(function() {
	"use strict";

	window.ScoreTracker = function(options) {
		var listenersMgr,
			currentScore,
			starLimits,
			that = this;

		function updateScore() {
			// don't update score after game has finished or score is already 0
			if(options.game.hasEnded() || currentScore <= 0) {
				return;
			}

			currentScore--;

			listenersMgr.trigger('change', {
				score: currentScore,
				stars: that.getNumberOfStars()
			});
		}

		function init() {
			var i, l;
			listenersMgr = new EventListenersManager(['change']);

			currentScore = 100;

			starLimits = options.game.getStarLimits();
			var tiles = options.game.getBoard().getTiles();

			for(i=0, l=tiles.length; i<l; i++) {
				tiles[i].on('rotate', updateScore);
				tiles[i].on('swap', updateScore);
			}
		}
		init();

		/**
		 * Allows to listen for score change ('change') event.
		 * @param {string} event
		 * @param {function} callback
		 */
		this.on = function (event, callback) {
			listenersMgr.addEventListener(event, callback);
		};

		/**
		 * Returns number of stars corresponding to current score.
		 * @returns {number}
		 */
		this.getNumberOfStars = function() {
			var stars = 0;

			for(var i=0; i<3; i++) {
				if(currentScore < starLimits[i]) {
					break;
				}

				stars++;
			}

			return stars;
		};

		/**
		 * Returns current score
		 * @returns {number}
		 */
		this.getCurrentScore = function() {
			return currentScore;
		};

		/**
		 * Destroys the object.
		 */
		this.destroy = function() {
			var i, l,
				tiles = options.game.getBoard().getTiles();

			for(i=0, l=tiles.length; i<l; i++) {
				tiles[i].off('rotate', updateScore);
				tiles[i].off('swap', updateScore);
			}

			listenersMgr.removeEventListener();
		};
	};
})();