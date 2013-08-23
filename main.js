var board = new Board({
	board: [
		[14, 35, 10],
		[15, 6,  10],
		[14, 6,  10]
	],
	locks: [
		[false, false, false],
		[false, false, true],
		[false, false, false]
	]
});

var printer = new TextBoardPrinter();
printer.print(board);

var htmlBoard = new HTMLBoard({
	board: board,
	element: document.getElementById('board')
});