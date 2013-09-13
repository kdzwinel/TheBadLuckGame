(function() {
	window.HTMLBoard = function(options) {
		var that = this,
			swapMode = false,
			leftRotationMode = false;

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

		function rotateTile(tile) {
			if(tile.isLocked()) {
				return;
			}

			if(leftRotationMode) {
				tile.rotateLeft();
			} else {
				tile.rotateRight();
			}
		}

		function activateLeftRotation(e) {
			if(e.keyCode === 32) {
				leftRotationMode = true;

				e.stopPropagation();
				e.preventDefault();
			}
		}

		function deactivateLeftRotation(e) {
			if(e.keyCode === 32) {
				leftRotationMode = false;
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
			document.addEventListener('keypress', activateLeftRotation);
			document.addEventListener('keyup', deactivateLeftRotation);
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

			DOMHelper.purgeElement(options.element);
			options.element.appendChild(newBoard);
			adjustBoardSize();

			//Swap Tile
			tile = options.board.getSwapTile();
			if(tile) {
				var swappableTile = new HTMLTile(tile);
				domNode = swappableTile.getDOMNode();

				options.swapContainer.appendChild( domNode );
			} else {
				options.swapContainer.style.display = 'none';
			}

		};

		this.destroy = function() {
			DOMHelper.purgeElement(options.element);
			DOMHelper.unbindAllEvents(options.element);
			options.element.classList.remove('swap-mode');

			DOMHelper.purgeElement(options.swapContainer);
			DOMHelper.unbindAllEvents(options.swapContainer);

			swapMode = false;
			window.removeEventListener('resize', adjustBoardSize);
			document.removeEventListener('keypress', activateLeftRotation);
			document.removeEventListener('keyup', deactivateLeftRotation);
		};

		init();
	};
}());