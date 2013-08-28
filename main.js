var board, printer, htmlBoard, mapLoader, game;

/**
 * @param {JSONLevel} level
 */
function initLevel(level) {
	game = new Game(level);

	htmlBoard = new HTMLBoard({
		board: game.getBoard(),
		element: document.getElementById('board')
	});

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