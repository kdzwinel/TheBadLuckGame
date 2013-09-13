(function() {
	"use strict";

	window.Tile = function(x, y, options) {
		if(options.start && options.end) {
			throw "Invalid tile.";
		}
		if(options.swappable && (options.start || options.end)) {
			throw "Invalid tile.";
		}

		this._x = x;
		this._y = y;
		this._roads = options.roads ? options.roads : [];
		this._start = options.start;
		this._end = options.end;
		this._swappable = options.swappable;
		this._locked = options.locked;
		this._listenersMgr = new EventListenersManager(['rotate','lock','unlock','swap','flag-added','flag-removed']);
		this._cars = options.cars;
		this._flags = [];
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
	 * Allows listening to predefined events (lock, unlock, rotate)
	 * @param {string} event
	 * @param {function} callback
	 */
	Tile.prototype.off = function(event, callback) {
		this._listenersMgr.removeEventListener(event, callback);
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
			throw "Not allowed."
		}

		this._locked = true;
		this._listenersMgr.trigger('lock');
	};

	/**
	 * Unlocks tile allowing rotation.
	 */
	Tile.prototype.unlock = function() {
		if(this.isStart() || this.isEnd()) {
			throw "Not allowed."
		}

		this._locked = false;
		this._listenersMgr.trigger('unlock');
	};

	/**
	 * Rotates tile left.
	 */
	Tile.prototype.rotateLeft = function() {
		if(this.isLocked()) {
			throw "Not allowed.";
		}
		
		var translate = function(input) {
			if(!input) {
				return input;
			}
			
			var trans = {n: 'w', s: 'e', w: 's', e: 'n'};
			return trans[input];
		};

		this._roads = {
			n: translate(this._roads.e),
			s: translate(this._roads.w),
			w: translate(this._roads.n),
			e: translate(this._roads.s)
		};
		this._listenersMgr.trigger('rotate', 'left');
	};

	/**
	 * Overrides current tile settings (excluding X and Y position) with settings from other tile.
	 *
	 * @param otherTile
	 */
	Tile.prototype.swap = function(otherTile) {
		if(this.isLocked() || !this.isSwappable()) {
			throw "Not allowed.";
		}

		this._roads = {
			n: otherTile.roadFromNorth(),
			s: otherTile.roadFromSouth(),
			w: otherTile.roadFromWest(),
			e: otherTile.roadFromEast()
		};
		this._locked = otherTile.isLocked();
		this._start = otherTile.isStart();
		this._end = otherTile.isEnd();
		this._swappable = otherTile.isSwappable();

		this._listenersMgr.trigger('swap');
	};

	/**
	 * Clones a tile.
	 *
	 * @returns {Tile}
	 */
	Tile.prototype.clone = function() {
		return new Tile(this.getX(), this.getY(), {
			roads: this._roads,
			start: this._start,
			end: this._end,
			swappable: this._swappable,
			locked: this._locked
		})
	};

	/**
	 * Rotates tile right.
	 */
	Tile.prototype.rotateRight = function() {
		if(this.isLocked()) {
			throw "Not allowed.";
		}
		
		var translate = function(input) {
			if(!input) {
				return input;
			}
			
			var trans = {n: 'e', s: 'w', w: 'n', e: 's'};
			return trans[input];
		};

		this._roads = {
			n: translate(this._roads.w),
			s: translate(this._roads.e),
			w: translate(this._roads.s),
			e: translate(this._roads.n)
		};
		this._listenersMgr.trigger('rotate', 'right');
	};

	/**
	 * Adds a custom flag to the tile.
	 */
	Tile.prototype.addFlag = function(flagName) {
		if(this.hasFlag(flagName)) {
			throw "Not allowed.";
		}

		this._flags.push(flagName);

		this._listenersMgr.trigger('flag-added', flagName);
	};

	/**
	 * Removes custom flag form a tile.
	 */
	Tile.prototype.removeFlag = function(flagName) {
		if(!this.hasFlag(flagName)) {
			throw "Not allowed.";
		}

		this._flags.splice(this._flags.indexOf(flagName), 1);

		this._listenersMgr.trigger('flag-removed', flagName);
	};

	/**
	 * Checks if given flag is set on current tile.
	 * @param {string} flagName
	 * @returns {boolean}
	 */
	Tile.prototype.hasFlag = function(flagName) {
		return (this._flags.indexOf(flagName) !== -1);
	};

	/**
	 * Returns list of all flags set on current tile.
	 * @returns {string[]}
	 */
	Tile.prototype.getFlags = function() {
		return this._flags;
	};

	Tile.prototype.roadFromNorth = function() {
		return this._roads.n;
	};

	Tile.prototype.roadFromSouth = function() {
		return this._roads.s;
	};

	Tile.prototype.roadFromWest = function() {
		return this._roads.w;
	};

	Tile.prototype.roadFromEast = function() {
		return this._roads.e;
	};

	/**
	 * Checks if tile has any roads defined.
	 * @returns {boolean}
	 */
	Tile.prototype.hasAnyRoad = function() {
		return (this.roadFromNorth() || this.roadFromSouth() || this.roadFromWest() || this.roadFromEast());
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
	 * Returns true if tile can be swapped with extra tile.
	 * @returns {boolean}
	 */
	Tile.prototype.isSwappable = function() {
		return this._swappable;
	};

	/**
	 * Returns true if tile is locked (note that start/ending tiles are always locked).
	 * @returns {boolean}
	 */
	Tile.prototype.isLocked = function() {
		return (this._locked === true || this.isStart() || this.isEnd());
	};

	/**
	 * Returns indexes of cars that should be deployed from this starting tile.
	 * @returns {number[]}
	 */
	Tile.prototype.getCarIndexes = function() {
		if(!this.isStart()) {
			throw "Not allowed.";
		}

		return this._cars;
	};
}());