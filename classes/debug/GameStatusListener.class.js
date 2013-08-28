(function () {
	"use strict";

	window.GameStatusListener = function (game) {
		var prefix = 'GAME STATUS: ',
			style = 'font-weight: bold; color: green;';

		game.on('game-started', function() {
			console.log('%c' + prefix + 'Game started', style);
		});

		game.on('car-added', function() {
			console.log('%c' + prefix + 'Car added (%i out of %i)', style, game.getDeployedCarsCount(), game.getAllCarsCount());
		});

		game.on('car-won', function() {
			console.log('%c' + prefix + 'Car won (cars won: %i, cars lost: %i, cars required: %i)', style, game.getWonCarsCount(), game.getLostCarsCount(), game.getRequiredCarsCount());
		});

		game.on('car-lost', function() {
			console.log('%c' + prefix + 'Car lost (cars won: %i, cars lost: %i, cars required: %i)', style, game.getWonCarsCount(), game.getLostCarsCount(), game.getRequiredCarsCount());
		});

		game.on('game-lost', function() {
			console.log('%c' + prefix + 'Game lost', style);
		});

		game.on('game-won', function() {
			console.log('%c' + prefix + 'Game won', style);
		});
	};
})();
