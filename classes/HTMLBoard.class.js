(function() {
	window.HTMLBoard = function(options) {
		var that = this;

		function init() {
			that.draw();
			addListeners();
		}

		function adjustBoardSize() {
			var boardMargin = 10,
				tileMargin = 4,
				tileSize;
			tileSize = Math.floor( (window.innerWidth - boardMargin) / options.board.getWidth()) - tileMargin;
			document.styleSheets[0].addRule('.tiles .row .tile', 'width: ' + tileSize + 'px; height: ' + tileSize + 'px');
		}

		function addListeners() {
			options.element.onclick = function(e) {
				if(!e.target.classList.contains('tile')) {
					return;
				}

				var tileDiv = e.target,
					tile = options.board.getTile(tileDiv.dataset.x, tileDiv.dataset.y);

				if(tile.isLocked()) {
					return;
				}

				if(e.altKey) {
					tile.rotateLeft();
				} else {
					tile.rotateRight();
				}
			};

			window.onresize = adjustBoardSize;
		}

		this.getDOMNode = function() {
			return options.element;
		};

		this.draw = function() {
			var w = options.board.getWidth(),
				h = options.board.getHeight(),
				newBoard = document.createDocumentFragment(),
				emptyRow = document.createElement('div'),
				currentRow, x, y, tile, htmlTile;

			emptyRow.className = 'row';
			for(y = 0; y < h; y++) {
				currentRow = emptyRow.cloneNode();
				for (x = 0; x < w; x++) {
					tile = options.board.getTile(x, y);
					htmlTile = new HTMLTile(tile);

					currentRow.appendChild( htmlTile.getDOMNode() );
				}
				newBoard.appendChild(currentRow);
			}

			options.element.innerHTML = '';
			options.element.appendChild(newBoard);
			adjustBoardSize();
		};

		init();
	};
}());