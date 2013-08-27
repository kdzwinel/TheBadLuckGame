(function() {
	"use strict";

	/**
	 * JSON tile definition.
	 *
	 * @class JSONTile
	 * @property {Object} road
	 * @property {boolean} start
	 * @property {boolean} end
	 * @property {boolean} locked
	 */

	/**
	 * JSON map definition.
	 *
	 * @class JSONMap
	 * @property {number} height
	 * @property {number} width
	 * @property {JSONTile[]} tiles
	 */

	/**
	 * @param {JSONMap} map
	 * @constructor
	 */
	window.Board = function(map) {
		var startTiles = [];
		var endTiles = [];

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