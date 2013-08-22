(function() {
	window.Board = function(options) {
		var board = [];
		var locks = [];

		function init() {
			board = options.board;
			locks = options.locks;
		}
		init();

		function encodeArea(area) {
			var num = 1;

			num *= (area.w) ? 2 : 1;
			num *= (area.n) ? 3 : 1;
			num *= (area.e) ? 5 : 1;
			num *= (area.s) ? 7 : 1;

			return num;
		}

		function decodeArea(number) {
			return {
				w: (number % 2 === 0),
				n: (number % 3 === 0),
				e: (number % 5 === 0),
				s: (number % 7 === 0)
			};
		}

		function failIfInvalidArea(x, y) {
			if(board[y] === undefined || board[y][x] === undefined) {
				throw 'Invalid area index ' + x + ', ' + y;
			}
		}

		/*********************
		******* PUBLIC *******
		**********************/

		this.rotateAreaLeft = function(x, y) {
			var area = this.getArea(x, y);

			board[y][x] = encodeArea({
				w: area.n,
				e: area.s,
				n: area.e,
				s: area.w
			});
		};

		this.rotateAreaRight = function(x, y) {
			var area = this.getArea(x, y);

			board[y][x] = encodeArea({
				w: area.s,
				e: area.n,
				n: area.w,
				s: area.e
			});
		};

		this.getWidth = function() {
			return (board[0] !== undefined) ? board[0].length : 0;
		};

		this.getHeight = function() {
			return board.length;
		};

		this.getArea = function(x, y) {
			failIfInvalidArea(x, y);

			return decodeArea(board[y][x]);
		};

		this.isLocked = function(x, y) {
			failIfInvalidArea(x, y);

			return locks[y][x];
		};

		this.lockArea = function(x, y) {
			failIfInvalidArea(x, y);

			locks[y][x] = true;
		};

		this.unlockArea = function(x, y) {
			failIfInvalidArea(x, y);

			locks[y][x] = false;
		};
	};
}());