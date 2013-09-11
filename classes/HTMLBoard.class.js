(function() {
	window.HTMLBoard = function(options) {
		var that = this;
		var swapMode = false;

		function init() {
			that.draw();
			addListeners();
		}

		function adjustBoardSize() {
			var stylesheet,
				widthMargin = 10,
				heightMargin = 65,
				tileMargin = 4,
				tileSize,
				widthTileSize = Math.floor( (window.innerWidth - widthMargin) / options.board.getWidth()) - tileMargin,
				heightTileSize = Math.floor( (window.innerHeight - heightMargin) / options.board.getHeight()) - tileMargin;

			tileSize = (widthTileSize < heightTileSize) ? widthTileSize : heightTileSize;
			stylesheet = document.styleSheets[0];
			stylesheet.insertRule('.tiles .row .tile { width: ' + tileSize + 'px; height: ' + tileSize + 'px }', stylesheet.cssRules.length);
		}

		function rotateOrSwapTile(e) {
			if(!e.target.classList.contains('tile')) {
				return;
			}

			var tileDiv = e.target,
				tile = options.board.getTile(tileDiv.dataset.x, tileDiv.dataset.y);

			if(!swapMode) {
				rotateTile(tile, e);
			} else {
				swapTile(tile);
			}
		}

		function rotateTile(tile, e) {
			if(tile.isLocked()) {
				return;
			}

			if(e.altKey) {
				tile.rotateLeft();
			} else {
				tile.rotateRight();
			}
		}

		function swapTile(tile) {
			if(tile.isLocked() || !tile.isSwappable()) {
				return;
			}

			var clone = tile.clone();
			var tileToSwap = options.board.getSwapTile();

			tile.swap(tileToSwap);
			tileToSwap.swap(clone);

			toggleSwapMode();
		}

		function toggleSwapMode() {
			if(!swapMode) {
				options.element.classList.add('swap-mode');
				swapMode = true;
			} else {
				options.element.classList.remove('swap-mode');
				swapMode = false;
			}
		}

		function addListeners() {
			new Tap(options.element);
			options.element.addEventListener('tap', rotateOrSwapTile, false);

			new Tap(options.swapContainer);
			options.swapContainer.addEventListener('tap', toggleSwapMode);

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
				currentRow, x, y, tile, htmlTile, domNode;

			//Board
			emptyRow.className = 'row';
			for(y = 0; y < h; y++) {
				currentRow = emptyRow.cloneNode(false);
				for (x = 0; x < w; x++) {
					tile = options.board.getTile(x, y);
					htmlTile = new HTMLTile(tile);

					currentRow.appendChild( htmlTile.getDOMNode() );
				}
				newBoard.appendChild(currentRow);
			}

			purgeElement(options.element);
			options.element.appendChild(newBoard);
			adjustBoardSize();

			//Swap Tile
			tile = options.board.getSwapTile();
			if(tile) {
				var swappableTile = new HTMLTile(tile);
				domNode = swappableTile.getDOMNode();

				options.swapContainer.appendChild( domNode );
			}

		};

		this.destroy = function() {
			purgeElement(options.element);
			unbindAllEvents(options.element);
			options.element.classList.remove('swap-mode');

			purgeElement(options.swapContainer);
			unbindAllEvents(options.swapContainer);

			swapMode = false;
			window.removeEventListener('resize', adjustBoardSize);
		};

		init();
	};
}());