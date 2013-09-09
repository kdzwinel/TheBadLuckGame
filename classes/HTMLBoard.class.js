(function() {
	window.HTMLBoard = function(options) {
		var that = this;

		function init() {
			that.draw();
			addListeners();
		}

		function adjustBoardSize() {
			var widthMargin = 10,
				heightMargin = 20,
				tileMargin = 4,
				tileSize,
				widthTileSize = Math.floor( (window.innerWidth - widthMargin) / options.board.getWidth()) - tileMargin,
				heightTileSize = Math.floor( (window.innerHeight - heightMargin) / options.board.getHeight()) - tileMargin;

			tileSize = (widthTileSize < heightTileSize) ? widthTileSize : heightTileSize;
			document.styleSheets[0].addRule('.tiles .row .tile', 'width: ' + tileSize + 'px; height: ' + tileSize + 'px');
		}

		function rotateTile(e) {
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
		}

		function addListeners() {
			new Tap(options.element);
			options.element.addEventListener('tap', rotateTile, false);

			window.addEventListener('resize', adjustBoardSize);
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

		this.destroy = function() {
			unbindAllEvents(options.element);
			options.element.innerHTML = '';
			window.removeEventListener('resize', adjustBoardSize);
		};

		init();
	};
}());