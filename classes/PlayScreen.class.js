(function() {
	"use strict";

	window.PlayScreen = function(options) {
		var mapLoader, game, htmlBoard, canvasManager, carManager, printer, listenersMgr;

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

			carManager = new CarManager(game);

			game.on('car-added', function(){
				carManager.addCar();
			});

			canvasManager = new CanvasManager({
				element        : options.element.querySelector('#canvas'),
				tilesHorizontal: game.getBoard().getWidth(),
				tilesVertical  : game.getBoard().getHeight()
			});

			canvasManager.addManager(carManager);
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