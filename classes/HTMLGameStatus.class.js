(function() {
	"use strict";

	window.HTMLGameStatus = function(options) {
		function init() {
			options.game.on('car-added', updateCarsStatus);
			options.scoreTracker.on('change', updateScore);
			updateCarsStatus();
			updateScore({
				score: options.scoreTracker.getCurrentScore(),
				stars: options.scoreTracker.getNumberOfStars()
			});
		}
		init();

		function updateCarsStatus() {
			options.carsStatusContainer.innerHTML = options.game.getDeployedCarsCount() + '/' + options.game.getAllCarsCount();
		}

		function updateScore(data) {
			options.scoreContainer.innerHTML = data.score;

			var starNodes = options.starsContainer.querySelectorAll('.star');

			for(var i=0; i<3; i++) {
				if(data.stars < (i+1)) {
					starNodes[i].classList.add('inactive');
				} else {
					starNodes[i].classList.remove('inactive');
				}
			}
		}
	};
})();