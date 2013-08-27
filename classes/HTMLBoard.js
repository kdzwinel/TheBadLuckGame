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

				that.draw();
			};
		}

		function createTile(area) {
			var div = document.createElement('div'),
				tileTypeClass = '';

			tileTypeClass += area.hasEastRoad() ? 'e':'';
			tileTypeClass += area.hasNorthRoad() ? 'n':'';
			tileTypeClass += area.hasSouthRoad() ? 's':'';
			tileTypeClass += area.hasWestRoad() ? 'w':'';

			div.classList.add('tile');
			if(tileTypeClass) {
				div.classList.add(tileTypeClass);
			}

			if(area.isStart()) {
				div.classList.add('start');
			} else if (area.isEnd()) {
				div.classList.add('end');
			} else if(area.isLocked()) {
				div.classList.add('locked');
			}

			div.dataset.x = area.getX();
			div.dataset.y = area.getY();

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