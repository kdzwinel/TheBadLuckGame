(function() {
	window.TextBoardPrinter = function() {

		function printToConsole(pixels, w, h) {
			var x, y, stringOutput;

			stringOutput = "";
			for(y = 0; y < h; y++) {
				for (x = 0; x < w; x++) {
					stringOutput += (pixels[y] && pixels[y][x]) ? '#' : ' ';
				}
				stringOutput += '\n';
			}

			console.log(stringOutput);
		}

		/**
		 * Prints simple text representation of the Board object
		 * @param board Board
		 */
		this.print = function(board) {
			var w = board.getWidth(),
				h = board.getHeight(),
				pixels = new Array(h * 3),
				x, y, area;

			for(y = 0; y < h; y++) {
				pixels[y * 3] = new Array(w * 3);
				pixels[y * 3 + 1] = new Array(w * 3);
				pixels[y * 3 + 2] = new Array(w * 3);

				for (x = 0; x < w; x++) {
					area = board.getArea(x, y);

					if(area.w) {
						pixels[y * 3 + 1][x * 3] = 1;
					}
					if(area.n) {
						pixels[y * 3][x * 3 + 1] = 1;
					}
					if(area.s) {
						pixels[y * 3 + 2][x * 3 + 1] = 1;
					}
					if(area.e) {
						pixels[y * 3 + 1][x * 3 + 2] = 1;
					}
					if(area.w || area.e || area.n || area.s) {
						pixels[y * 3 + 1][x * 3 + 1] = 1;
					}
				}
			}

			printToConsole(pixels, w * 3, h * 3);
		};
	};
}());