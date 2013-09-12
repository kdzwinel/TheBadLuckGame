(function () {
	"use strict";

	window.PlayScreen = function (options) {
		var mapLoader,
			game,
			htmlBoard,
			htmlGameStatus,
			canvasManager,
			carManager,
			collisionDetector,
			listenersMgr,
			logicInterval,
			scoreTracker,
			pauseScreen,
			endScreen,
			levelName,
			that = this;

		function init() {
			listenersMgr = new EventListenersManager(['close', 'won']);

			mapLoader = new MapLoader();
			mapLoader.on('load', initLevel);
			mapLoader.on('error', function (error) {
				console.error(error);
			});
		}

		init();

		function addEventListeners() {
			var pauseButton = options.element.querySelector('#pause-button');
			new Tap(pauseButton);
			pauseButton.addEventListener('tap', function () {
				pause();
			});
		}

		function pause() {
			stopLogicInterval();
			canvasManager.stopAnimation();
			pauseScreen.show();
		}

		function shakeScreen() {
			setTimeout(function () {
				options.element.classList.add('shake');
				setTimeout(function () {
					options.element.classList.remove('shake');
				}, 400);
			}, 70); // do not block ui
		}

		function stopLogicInterval() {
			clearInterval(logicInterval);
			logicInterval = undefined;
		}

		function startLogicInterval() {
			if (!logicInterval) {
				logicInterval = setInterval(function () {
					carManager.step(canvasManager.getTileSize());
					collisionDetector.checkCollisions();
				}, 16);
			}
		}

		function restartLevel() {
			that.afterHide();
			that.beforeShow({
				levelName: levelName
			});
		}

		/**
		 * @param {JSONLevel} level
		 */
		function initLevel(level) {
			game = new Game(level);

			scoreTracker = new ScoreTracker({
				game: game
			});

			pauseScreen = new PauseScreen({
				element: options.element.querySelector('#paused')
			});

			endScreen = new EndScreen({
				element: options.element.querySelector('#win-loose')
			});

			pauseScreen.on('resume-game', function() {
				startLogicInterval();
				canvasManager.startAnimation();
			});

			pauseScreen.on('back-to-levels', function() {
				listenersMgr.trigger('close');
			});

			endScreen.on('back-to-levels', function() {
				listenersMgr.trigger('close');
			});

			endScreen.on('restart-level', restartLevel);

			htmlBoard = new HTMLBoard({
				board: game.getBoard(),
				swapContainer: options.element.querySelector('#swap-tile'),
				element: options.element.querySelector('.tiles')
			});

			htmlGameStatus = new HTMLGameStatus({
				game: game,
				scoreTracker: scoreTracker,
				carsStatusContainer: options.element.querySelector('.cars-deployed'),
				scoreContainer: options.element.querySelector('.current-score'),
				starsContainer: options.element.querySelector('.star-container')
			});

			canvasManager = new CanvasManager({
				element: options.element.querySelector('#canvas'),
				tilesHorizontal: game.getBoard().getWidth(),
				tilesVertical: game.getBoard().getHeight()
			});

			carManager = new CarManager(game);
			collisionDetector = new CollisionDetector();

			game.on('car-added', function (data) {
				var car = carManager.addCar({
						startX: data.startTile.getX(),
						startY: data.startTile.getY(),
						velocity: data.velocity
					});

				car.on('crash', function (car) {

					if (!car.alive) {
						collisionDetector.removeObject(car);
						shakeScreen();
					}
				});

				car.on('trip-end', function (car) {
					collisionDetector.removeObject(car);
				});

				collisionDetector.addObject(car);
			});

			game.on('game-started', function () {
				startLogicInterval();
			});

			game.on('game-won', function() {
				endScreen.showWin();

				listenersMgr.trigger('won', {
					levelName: levelName,
					score: scoreTracker.getCurrentScore(),
					stars: scoreTracker.getNumberOfStars()
				});
			});

			game.on('game-won', function() {
				endScreen.showWin(scoreTracker.getNumberOfStars());
			})

			game.on('game-lost', function() {
				endScreen.showLoose();
			});

			canvasManager.addManager(carManager);
			canvasManager.startAnimation();
		}

		/**
		 * Allows to listen for various in-game events.
		 * @param {string} event
		 * @param {function} callback
		 */
		this.on = function (event, callback) {
			listenersMgr.addEventListener(event, callback);
		};

		this.getDOMNode = function () {
			return options.element;
		};

		this.beforeShow = function (data) {
			levelName = data.levelName;
			mapLoader.load(levelName);
		};

		this.afterShow = function () {
			addEventListeners();
		};

		this.beforeHide = function () {
			DOMHelper.unbindAllEvents(options.element.querySelector('#pause-button'));
		};

		this.afterHide = function () {
			scoreTracker.destroy();
			scoreTracker = null;

			htmlBoard.destroy();
			htmlBoard = null;

			game.destroy();
			game = null;

			carManager = null;


			collisionDetector = null;

			canvasManager.destroy();
			canvasManager = null;

			pauseScreen.destroy();
			pauseScreen = null;

			endScreen.destroy();
			endScreen = null;

			clearInterval(logicInterval);
			logicInterval = null;
		};
	}
})();