(function () {
	"use strict";

	window.PlayScreen = function (options) {
		var mapLoader,
			game,
			htmlBoard,
			htmlGameStatus,
			canvasManager,
			carManager,
			particleEmitterManager,
			collisionDetector,
			printer,
			listenersMgr,
			logicInterval,
			scoreTracker;

		function init() {
			listenersMgr = new EventListenersManager(['close']);

			mapLoader = new MapLoader();
			mapLoader.on('load', initLevel);
			mapLoader.on('error', function (error) {
				console.error(error);
			});
		}

		init();

		function addEventListeners() {
			var backButton = options.element.querySelector('#back-button');
			new Tap(backButton);
			backButton.addEventListener('tap', function () {
				listenersMgr.trigger('close');
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
			particleEmitterManager = new ParticleEmitterManager();
			collisionDetector = new CollisionDetector();

			game.on('car-added', function (data) {
				var car = carManager.addCar({
						startX: data.startTile.getX(),
						startY: data.startTile.getY(),
						velocity: data.velocity
					}),
					emitter = particleEmitterManager.addEmitter(car.appearance.getExplosionObject());

				car.on('crash', function (car) {
					emitter.emit(car.x, car.y);

					if (!car.alive) {
						collisionDetector.removeObject(car);
						setTimeout(function () {
							options.element.classList.add('shake');
							setTimeout(function () {
								options.element.classList.remove('shake');
							}, 400);
						}, 70); // do not block ui

					}
				});

				car.on('trip-end', function (car) {
					collisionDetector.removeObject(car);
				});

				collisionDetector.addObject(car);
			});

			game.on('game-started', function () {
				if (!logicInterval) {
					logicInterval = setInterval(function () {

						carManager.step(canvasManager.getTileSize());
						collisionDetector.checkCollisions();
					}, 16);
				}
			});

			canvasManager.addManager(carManager);
			canvasManager.addManager(particleEmitterManager);
			canvasManager.startAnimation();

			/* DEBUG */
			printer = new TextBoardPrinter();
			printer.print(game.getBoard());
			new GameStatusListener(game);

			window.printer = printer;
			window.game = game;
			window.htmlBoard = htmlBoard;
			window.canvasManager = canvasManager;
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
			mapLoader.load(data.levelName);
		};

		this.afterShow = function () {
			addEventListeners();
		};

		this.beforeHide = function () {
			DOMHelper.unbindAllEvents(options.element.querySelector('#back-button'));
		};

		this.afterHide = function () {
			scoreTracker.destroy();
			scoreTracker = null;

			htmlBoard.destroy();
			htmlBoard = null;

			game.destroy();
			game = null;

			carManager = null;

			particleEmitterManager = null;

			collisionDetector = null;

			canvasManager.destroy();
			canvasManager = null;

			clearInterval(logicInterval);
			logicInterval = null;
		};
	}
})();