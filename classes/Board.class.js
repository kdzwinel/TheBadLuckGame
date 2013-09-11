(function() {
	"use strict";

	/**
	 * @param {JSONMap} map
	 * @constructor
	 */
	window.Board = function(map) {
		var startTiles = [],
			endTiles = [],
			swappableTile = null;

		function init() {
			var x, y, tile;

			for(y=0; y < map.height; y++) {
				for(x=0; x < map.width; x++) {
					if(!map.tiles[y] || !map.tiles[y][x]) {
						throw "Map definition is invalid. Tile " + x + "," + y + " doesn't exist.";
					}

					tile = new Tile(x, y, map.tiles[y][x]);
					map.tiles[y][x] = tile;

					if(tile.isStart()) {
						startTiles.push(tile);
					}
					if(tile.isEnd()) {
						endTiles.push(tile);
					}
				}
			}

			if(!startTiles.length) {
				throw "Map definition is invalid. There are no start tiles.";
			}
			if(!endTiles.length) {
				throw "Map definition is invalid. There are no end tiles.";
			}

			if(map.swapTile) {
				//make sure that swap tile is swappable
				map.swapTile.swappable = true;

				swappableTile = new Tile(0, 0, map.swapTile);
			}
		}
		init();

		function failIfInvalidTile(x, y) {
			if(map.tiles[y] === undefined || map.tiles[y][x] === undefined) {
				throw 'Invalid area index ' + x + ', ' + y;
			}
		}

		/*********************
		******* PUBLIC *******
		**********************/

		/**
		 * Get map width.
		 * @returns {number}
		 */
		this.getWidth = function() {
			return map.width;
		};

		/**
		 * Get map height.
		 * @returns {number}
		 */
		this.getHeight = function() {
			return map.height;
		};

		/**
		 * Get array of starting tiles.
		 * @returns {Tile[]}
		 */
		this.getStartTiles = function() {
			return startTiles;
		};

		/**
		 * Get array of ending tiles.
		 * @returns {Tile[]}
		 */
		this.getEndTiles = function() {
			return endTiles;
		};

		/**
		 * Get extra tile that may be swapped.
		 * @returns {Tile}
		 */
		this.getSwapTile = function() {
			return swappableTile;
		};

		/**
		 * Return single tile at given position.
		 *
		 * @param x {number}
		 * @param y {number}
		 * @returns {Tile}
		 */
		this.getTile = function(x, y) {
			failIfInvalidTile(x, y);

			return map.tiles[y][x];
		};
	};
}());