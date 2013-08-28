(function () {
	"use strict";

	/**
	 * @param {JSONLevel} level
	 * @constructor
	 */
	window.Game = function (level) {
		var listeners = {
			'game-started': [],
			'car-added': [],
			'car-lost': [],
			'car-won': [],
			'game-won': [],
			'game-lost': []
			},
			board,
			deployedCarsCount = 0,
			lostCarsCount = 0,
			wonCarsCount = 0,
			state = 'waiting',
			startTimer, carTimer;

		function init() {
			board = new Board(level.map);
			startTimer = setTimeout(startGame, level.startTimeout);
		}
		init();

		function startGame() {
			state = 'running';
			trigger('game-started');

			addCar();
		}

		function addCar() {
			deployedCarsCount++;
			trigger('car-added');

			if(deployedCarsCount < level.carCount) {
				carTimer = setTimeout(addCar, level.carTimeout);
			}
		}

		function trigger(event, data) {
			if (listeners[event] === undefined) {
				throw 'Unknown event "' + event + '"';
			}

			for (var i = 0, l = listeners[event].length; i < l; i++) {
				listeners[event][i](this, data);
			}
		}

		function checkIfGameFinished() {
			if((level.carCount - lostCarsCount) < level.carsToWin) {
				//too many cars have been destroyed - game lost
				state = "lost";
				trigger('game-lost');
			} else if(wonCarsCount + lostCarsCount === level.carCount) {
				//all cars have arrived or have been destroyed (but enough to win the game)
				state = "won";
				trigger('game-won');
			}
		}

		/**
		 * Returns game board.
		 * @returns {Board}
		 */
		this.getBoard = function() {
			return board;
		};

		/**
		 * Returns game state (one of: 'waiting', 'running', 'lost', 'won')
		 * @returns {string}
		 */
		this.getState = function() {
			return state;
		};

		/**
		 * Returns number of cars that have been deployed.
		 * @returns {number}
		 */
		this.getDeployedCarsCount = function() {
			return deployedCarsCount;
		};

		/**
		 * Returns number of cars that have been lost.
		 * @returns {number}
		 */
		this.getLostCarsCount = function() {
			return lostCarsCount;
		};

		/**
		 * Returns number of cars that have reached the ending tile.
		 * @returns {number}
		 */
		this.getWonCarsCount = function() {
			return wonCarsCount;
		};

		/**
		 * Returns number of cars that are required to reach ending tile in order to win the game.
		 * @returns {number}
		 */
		this.getRequiredCarsCount = function() {
			return level.carsToWin;
		};

		/**
		 * Returns number of all cars (these that have been deployed + these that haven't been deployed yet)
		 * @returns {number}
		 */
		this.getAllCarsCount = function() {
			return level.carCount;
		};

		/**
		 * Informs that car have arrived the ending tile.
		 */
		this.carWon = function() {
			wonCarsCount++;
			trigger('car-won');

			checkIfGameFinished();
		};

		/**
		 * Informs that car have been lost.
		 */
		this.carLost = function() {
			lostCarsCount++;
			trigger('car-lost');

			checkIfGameFinished();
		};

		/**
		 * Allows to listen for various in-game events.
		 * @param {string} event
		 * @param {function} callback
		 */
		this.on = function (event, callback) {
			if (listeners[event] === undefined) {
				throw 'Unknown event "' + event + '"';
			}

			if (typeof callback !== "function") {
				throw 'Second argument must be a function.';
			}

			listeners[event].push(callback);
		};
	}
})();