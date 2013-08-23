(function() {
	window.HTMLBoard = function(options) {
		var that = this;

		function init() {
			that.draw();
			addListeners();
		}

		function addListeners() {
			options.element.onclick = function(e) {
				if(!e.target.classList.contains('cell') || e.target.classList.contains('locked')) {
					return;
				}

				var cell = e.target;
				if(e.altKey) {
					options.board.rotateAreaLeft(cell.dataset.x, cell.dataset.y);
				} else {
					options.board.rotateAreaRight(cell.dataset.x, cell.dataset.y);
				}
				that.draw();
			};
		}

		function createCell(area, x, y, locked) {
			var div = document.createElement('div'),
				cellTypeClass = '';

			cellTypeClass += area.e ? 'e':'';
			cellTypeClass += area.n ? 'n':'';
			cellTypeClass += area.s ? 's':'';
			cellTypeClass += area.w ? 'w':'';

			div.classList.add('cell');
			div.classList.add(cellTypeClass);
			if(locked) {
				div.classList.add('locked');
			}

			div.dataset.x = x;
			div.dataset.y = y;

			return div;
		}

		this.draw = function() {
			var w = options.board.getWidth(),
				h = options.board.getHeight(),
				newBoard = document.createDocumentFragment(),
				emptyRow = document.createElement('div'),
				currentRow, x, y, area;

			emptyRow.className = 'row';
			for(y = 0; y < h; y++) {
				currentRow = emptyRow.cloneNode();
				for (x = 0; x < w; x++) {
					area = options.board.getArea(x, y);
					currentRow.appendChild( createCell(area, x, y, options.board.isLocked(x, y)) );
				}
				newBoard.appendChild(currentRow);
			}

			options.element.innerHTML = '';
			options.element.appendChild(newBoard);

		};

		init();
	};
}());