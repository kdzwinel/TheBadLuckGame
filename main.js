var board = new Board({
	board: [
		[14, 35],
		[15, 6 ]
	],
	locks: [
		[false, false],
		[false, false]
	]
});

var printer = new TextBoardPrinter();

printer.print(board);