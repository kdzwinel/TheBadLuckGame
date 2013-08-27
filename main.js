var board, printer, htmlBoard;

function initMap(level) {
	board = new Board(level.map);

	printer = new TextBoardPrinter();
	printer.print(board);

	htmlBoard = new HTMLBoard({
		board: board,
		element: document.getElementById('board')
	});
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

	initMap(JSON.parse(xhr.responseText));
};

xhr.open('GET', 'levels/1.json');
xhr.send();
