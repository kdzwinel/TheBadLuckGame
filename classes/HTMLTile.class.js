(function() {
	"use strict";

	/**
	 * @param {Tile} tile
	 * @constructor
	 */
	window.HTMLTile = function(tile) {
		this._tile = tile;
		this._node = null;
		this._rotation = 0;
	};

	HTMLTile.prototype._rotate = function() {
		this._node.style.transform = "rotate(" + this._rotation + "deg)";
		this._node.style.webkitTransform = "rotate(" + this._rotation + "deg)";
	};

	HTMLTile.prototype._wasRotated = function(rotation) {
		if(rotation === "left") {
			this._rotation -= 90;
		} else if (rotation === "right") {
			this._rotation += 90;
		}

		this._rotate();
	};

	HTMLTile.prototype._wasLocked = function() {
		this._node.classList.add('locked');
	};

	HTMLTile.prototype._wasUnlocked = function() {
		this._node.classList.remove('locked');
	};

	HTMLTile.prototype._addEventListeners = function() {
		this._tile.on('rotate', this._wasRotated.bind(this));
		this._tile.on('lock', this._wasLocked.bind(this));
		this._tile.on('unlock', this._wasUnlocked.bind(this));
	};

	HTMLTile.prototype._createDOMNode = function() {
		this._node = document.createElement('div');
		var tileTypeClass = '',
			n = this._tile.roadFromNorth(),
			s = this._tile.roadFromSouth(),
			e = this._tile.roadFromEast(),
			w = this._tile.roadFromWest();

		if( n === 's' && s === 'n' && !w && !e ) {
			tileTypeClass = 'straight';
			this._rotation = 90;
		} else if( w === 'e' && e === 'w' && !n && !s ) {
			tileTypeClass = 'straight';
			this._rotation = 0;
		} else if( w === 'n' && !e && n === 'w' && !s ) {
			tileTypeClass = 'turn';
			this._rotation = 90;
		} else if( w === 's' && !e && !n && s === 'w' ) {
			tileTypeClass = 'turn';
			this._rotation = 0;
		} else if( !w && e === 'n' && n === 'e' && !s ) {
			tileTypeClass = 'turn';
			this._rotation = 180;
		} else if( !w && e === 's' && !n && s === 'e' ) {
			tileTypeClass = 'turn';
			this._rotation = 270;
		} else if( n === 's' && s === 'n' && w === 'e' && e === 'w' ) {
			tileTypeClass = 'junction';
			this._rotation = 0;
		} else if( n === 'e' && e === 'n' && w === 's' && s === 'w') {
			tileTypeClass = 'two-turns';
			this._rotation = 0;
		} else if( n === 'w' && w === 'n' && e === 's' && s === 'e') {
			tileTypeClass = 'two-turns';
			this._rotation = 90;
		}

		this._node.classList.add('tile');
		if(tileTypeClass) {
			this._node.classList.add(tileTypeClass);
		}

		this._rotate();

		if(this._tile.isStart()) {
			this._node.classList.add('start');
		} else if (this._tile.isEnd()) {
			this._node.classList.add('end');
		} else if(this._tile.isLocked()) {
			this._node.classList.add('locked');
		}

		this._node.dataset.x = this._tile.getX();
		this._node.dataset.y = this._tile.getY();

		this._addEventListeners();
	};

	/**
	 * Returns DOM object representing a board tile.
	 * @returns {HTMLDivElement}
	 */
	HTMLTile.prototype.getDOMNode = function() {
		if(!this._node) {
			this._createDOMNode();
		}

		return this._node;
	};
}());