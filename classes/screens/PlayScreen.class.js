(function() {
	"use strict";

	window.PlayScreen = function(options) {
		var mapLoader, game, htmlBoard, canvasManager, carManager, particleEmitterManager, collisionDetector, printer, listenersMgr, logicInterval;

		function init() {
			listenersMgr = new EventListenersManager(['close']);

			mapLoader = new MapLoader();
			mapLoader.on('load', initLevel);
			mapLoader.on('error', function(error) {
				console.error(error);
			});
		}
		init();

		function addEventListeners() {
			var backButton = options.element.querySelector('.back-button');
			backButton.onclick = function() {
				listenersMgr.trigger('close');
			};
		}

		/**
		 * @param {JSONLevel} level
		 */
		function initLevel(level) {
			game = new Game(level);

			htmlBoard = new HTMLBoard({
				board: game.getBoard(),
				element: options.element.querySelector('.tiles')
			});

			canvasManager = new CanvasManager({
				element        : options.element.querySelector('#canvas'),
				tilesHorizontal: game.getBoard().getWidth(),
				tilesVertical  : game.getBoard().getHeight()
			});

			carManager = new CarManager(game);
			particleEmitterManager = new ParticleEmitterManager();
			collisionDetector = new CollisionDetector();


			game.on('car-added', function(){
				var car = carManager.addCar(),
					emitter = particleEmitterManager.addEmitter(car.appearance.getExplosionObject());

				car.on('crash', function(car){
					emitter.emit(car.x, car.y);

					if(!car.alive) {
						collisionDetector.removeObject(car);
					}
				});

				collisionDetector.addObject(car);
			});

			game.on('game-started', function() {
				if(!logicInterval) {
					logicInterval = setInterval(function() {

						carManager.step(canvasManager.getTileSize());
						collisionDetector.checkCollisions();
					},16);	
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

		this.getDOMNode = function() {
			return options.element;
		};

		this.beforeShow = function(data) {
			mapLoader.load(data.levelName);
		};

		this.afterShow = function() {
			addEventListeners();
		};

		this.beforeHide = function() {

		};

		this.afterHide = function() {

		};
	}
})();