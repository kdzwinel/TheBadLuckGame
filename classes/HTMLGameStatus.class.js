(function() {
	"use strict";

	window.HTMLGameStatus = function(options) {
		function init() {
			options.game.on('car-added', updateCarsStatus);
			updateCarsStatus();
		}
		init();

		function updateCarsStatus() {
			options.carsStatusContainer.innerHTML = options.game.getDeployedCarsCount() + '/' + options.game.getAllCarsCount();
		}
	};
})();