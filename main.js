<<<<<<< HEAD
var board, printer, htmlBoard, canvasManager;
=======
var board, printer, htmlBoard, mapLoader, game;
>>>>>>> e430470bd610f8e95a3f849546460189d18bb53c

/**
 * @param {JSONLevel} level
 */
function initLevel(level) {
	game = new Game(level);

	htmlBoard = new HTMLBoard({
		board: game.getBoard(),
		element: document.getElementById('board')
	});
<<<<<<< HEAD

	canvasManager = new CanvasManager();
}

/*
MAP LOADING
TODO Move this to 'MapLoader'
 */
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
	if (xhr.readyState !== 4) {
		return;
	}

	if (xhr.status !== 200) {
		throw "Error fetching level JSON.";
	}
=======
>>>>>>> e430470bd610f8e95a3f849546460189d18bb53c

	/* DEBUG */
	printer = new TextBoardPrinter();
	printer.print(game.getBoard());
	new GameStatusListener(game);
}

mapLoader = new MapLoader();
mapLoader.on('load', initLevel);
mapLoader.on('error', function(error) {
	console.error(error);
});
mapLoader.load('1');
