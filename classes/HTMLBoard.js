(function() {
	window.HTMLBoard = function(options) {
		var that = this;

		function init() {
			that.draw();
			addListeners();
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

				setTileClass(e.target, tile);
			};
		}
		
		function setTileClass(div, tile) {
			var tileTypeClass = '';

			div.className = '';

			tileTypeClass += tile.hasEastRoad() ? 'e':'';
			tileTypeClass += tile.hasNorthRoad() ? 'n':'';
			tileTypeClass += tile.hasSouthRoad() ? 's':'';
			tileTypeClass += tile.hasWestRoad() ? 'w':'';

			div.classList.add('tile');
			if(tileTypeClass) {
				div.classList.add(tileTypeClass);
			}

			if(tile.isStart()) {
				div.classList.add('start');
			} else if (tile.isEnd()) {
				div.classList.add('end');
			} else if(tile.isLocked()) {
				div.classList.add('locked');
			}
		}

		function createTile(tile) {
			var div = document.createElement('div');

			setTileClass(div, tile);

			div.dataset.x = tile.getX();
			div.dataset.y = tile.getY();

			return div;
		}

		this.draw = function() {
			var w = options.board.getWidth(),
				h = options.board.getHeight(),
				newBoard = document.createDocumentFragment(),
				emptyRow = document.createElement('div'),
				currentRow, x, y, tile;

			emptyRow.className = 'row';
			for(y = 0; y < h; y++) {
				currentRow = emptyRow.cloneNode();
				for (x = 0; x < w; x++) {
					tile = options.board.getTile(x, y);
					//TODO extract HTMLTile class
					currentRow.appendChild( createTile(tile) );
				}
				newBoard.appendChild(currentRow);
			}

			options.element.innerHTML = '';
			options.element.appendChild(newBoard);
		};

		init();
	};
}());