(function() {
	"use strict";

	window.Tile = function(x, y, options) {
		if(options.start && options.end) {
			throw "Tile can't be both a starting and ending tail.";
		}

		this._x = x;
		this._y = y;
		this._roads = options.road ? options.road : {};
		this._start = options.start;
		this._end = options.end;
		this._locked = options.locked;
		this._listenersMgr = new EventListenersManager(['rotate','lock', 'unlock']);
	};

	/**
	 * Allows listening to predefined events (lock, unlock, rotate)
	 * @param {string} event
	 * @param {function} callback
	 */
	Tile.prototype.on = function(event, callback) {
		this._listenersMgr.addEventListener(event, callback);
	};

	/**
	 * Returns tile's X position on board.
	 * @returns {number}
	 */
	Tile.prototype.getX = function() {
		return this._x;
	};

	/**
	 * Returns tile's Y position on board.
	 * @returns {number}
	 */
	Tile.prototype.getY = function() {
		return this._y;
	};

	/**
	 * Locks tile to prevent rotation.
	 */
	Tile.prototype.lock = function() {
		if(this.isStart() || this.isEnd()) {
			throw "It's impossible to lock start/end tile."
		}

		this._locked = true;
		this._listenersMgr.trigger('lock');
	};

	/**
	 * Unlocks tile allowing rotation.
	 */
	Tile.prototype.unlock = function() {
		if(this.isStart() || this.isEnd()) {
			throw "It's impossible to unlock start/end tile."
		}

		this._locked = false;
		this._listenersMgr.trigger('unlock');
	};

	/**
	 * Rotates tile left.
	 */
	Tile.prototype.rotateLeft = function() {
		if(this.isLocked()) {
			throw "Locked tiles can't be rotated.";
		}

		this._roads = {
			n: this._roads.e,
			s: this._roads.w,
			w: this._roads.n,
			e: this._roads.s
		};
		this._listenersMgr.trigger('rotate', 'left');
	};

	/**
	 * Rotates tile right.
	 */
	Tile.prototype.rotateRight = function() {
		if(this.isLocked()) {
			throw "Locked tiles can't be rotated.";
		}

		this._roads = {
			n: this._roads.w,
			s: this._roads.e,
			w: this._roads.s,
			e: this._roads.n
		};
		this._listenersMgr.trigger('rotate', 'right');
	};

	Tile.prototype.hasNorthRoad = function() {
		return (this._roads.n === true);
	};

	Tile.prototype.hasSouthRoad = function() {
		return (this._roads.s === true);
	};

	Tile.prototype.hasWestRoad = function() {
		return (this._roads.w === true);
	};

	Tile.prototype.hasEastRoad = function() {
		return (this._roads.e === true);
	};

	/**
	 * Checks if tile has any roads defined.
	 * @returns {boolean}
	 */
	Tile.prototype.hasRoad = function() {
		return (this.hasNorthRoad() || this.hasSouthRoad() || this.hasWestRoad() || this.hasEastRoad());
	};

	/**
	 * Returns true if tile is a start tile.
	 * @returns {boolean}
	 */
	Tile.prototype.isStart = function() {
		return (this._start === true);
	};

	/**
	 * Returns true is tile is an ending tile.
	 * @returns {boolean}
	 */
	Tile.prototype.isEnd = function() {
		return (this._end === true);
	};

	/**
	 * Returns true if tile is locked (note that start/ending tiles are always locked).
	 * @returns {boolean}
	 */
	Tile.prototype.isLocked = function() {
		return (this._locked === true || this.isStart() || this.isEnd());
	};
}());