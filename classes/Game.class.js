(function () {
	"use strict";

	/**
	 * @param {JSONLevel} level
	 * @constructor
	 */
	window.Game = function (level) {
		var listenersMgr,
			board,
			deployedCarsCount = 0,
			lostCarsCount = 0,
			wonCarsCount = 0,
			state = 'waiting',
			startTimer, carTimer;

		function init() {
			listenersMgr = new EventListenersManager([
				'game-started',
				'car-added',
				'car-lost',
				'car-won',
				'game-won',
				'game-lost'
			]);

			if(level.carCount < 1) {
				throw "Level needs at least one car.";
			}

			if(level.carCount < level.carsToWin) {
				throw "Invalid number of cars required to win the game.";
			}

			if(!level.starLimits || level.starLimits.length !== 3) {
				throw "Star limits are invalid.";
			}

			board = new Board(level.map);
			startTimer = setTimeout(startGame, level.startTimeout);

			var startTile = getNextStartingTile();
			startTile.addFlag('car-approaching');
		}
		init();

		function startGame() {
			state = 'running';
			listenersMgr.trigger('game-started');

			addCar();
		}

		//returns tile that next car will start from
		function getNextStartingTile() {
			var i, l, startTiles, tile, carIndexes;

			startTiles = board.getStartTiles();

			for(i=0, l=startTiles.length; i<l; i++) {
				tile = startTiles[i];
				carIndexes = tile.getCarIndexes();

				if(carIndexes && carIndexes.indexOf(deployedCarsCount) !== -1) {
					break;
				}
			}

			return tile;
		}

		function addCar() {
			var startTile;

			if(state === 'lost' || state === 'won') {
				throw "Game is already finished. Can't add cars.";
			}

			startTile = getNextStartingTile();
			startTile.removeFlag('car-approaching');

			deployedCarsCount++;
			listenersMgr.trigger('car-added', {
				startTile: startTile,
				velocity: level.carSpeed
			});

			if(deployedCarsCount < level.carCount) {
				carTimer = setTimeout(addCar, level.carTimeout);
				startTile = getNextStartingTile();
				startTile.addFlag('car-approaching');
			}
		}

		function checkIfGameFinished() {
			if((level.carCount - lostCarsCount) < level.carsToWin) {
				//too many cars have been destroyed - game lost
				state = "lost";
				listenersMgr.trigger('game-lost');
				clearInterval(carTimer);
			} else if(wonCarsCount + lostCarsCount === level.carCount) {
				//all cars have arrived or have been destroyed (but enough to win the game)
				state = "won";
				listenersMgr.trigger('game-won');
			}
		}

		/**
		 * Stops all timeouts
		 */
		this.pause = function() {
			clearTimeout(startTimer);
			clearTimeout(carTimer);
		};

		/**
		 * Resumes all timeouts
		 */
		this.resume = function() {
			if(state === 'running') {
				carTimer = setTimeout(addCar, level.carTimeout);
			} else if(state === 'waiting') {
				startTimer = setTimeout(startGame, level.startTimeout);
			}
		};

		/**
		 * Returns game board.
		 * @returns {Board}
		 */
		this.getBoard = function() {
			return board;
		};

		/**
		 * Returns true if game has already ended (either was won or lost)
		 * @returns {boolean}
		 */
		this.hasEnded = function() {
			return (state === 'lost' || state === 'won');
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
		 * Returns array with star limits (number of points needed for each star)
		 * @returns {number[]}
		 */
		this.getStarLimits = function() {
			return level.starLimits;
		};

		/**
		 * Informs that car have arrived the ending tile.
		 */
		this.carWon = function() {
			wonCarsCount++;
			listenersMgr.trigger('car-won');

			checkIfGameFinished();
		};

		/**
		 * Informs that car have been lost.
		 */
		this.carLost = function() {
			lostCarsCount++;
			listenersMgr.trigger('car-lost');

			checkIfGameFinished();
		};

		/**
		 * Allows to listen for various in-game events.
		 * @param {string} event
		 * @param {function} callback
		 */
		this.on = function (event, callback) {
			listenersMgr.addEventListener(event, callback);
		};

		/**
		 * Destroys object (cleans all timeouts and listeners).
		 */
		this.destroy = function() {
			listenersMgr.removeEventListener();
			if(startTimer) {
				clearTimeout(startTimer);
			}
			if(carTimer) {
				clearTimeout(carTimer);
			}
		}
	}
})();