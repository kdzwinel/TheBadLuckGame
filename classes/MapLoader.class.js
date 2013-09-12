/**
 * JSON level definition.
 *
 * @class JSONLevel
 * @property {number} carCount number of cars that will be deployed
 * @property {number} carTimeout number of ms between each car is deployed
 * @property {number} startTimeout number of ms before game is started
 * @property {number} carsToWin number of cars that need to reach the ending tile to win the game
 * @property {number[]} starLimits limits of points that allow to calculate number of stars
 * @property {JSONMap} map
 */

/**
 * JSON map definition.
 *
 * @class JSONMap
 * @property {number} height
 * @property {number} width
 * @property {JSONTile} swapTile
 * @property {JSONTile[]} tiles
 */

/**
 * JSON tile definition.
 *
 * @class JSONTile
 * @property {Object} roads
 * @property {boolean} start
 * @property {boolean} end
 * @property {boolean} locked
 * @property {boolean} swappable
 * @property {number[]} cars Indexes of cars that should be deployed from this start tile
 */

(function () {
	"use strict";

	window.MapLoader = function () {
		var listenersMgr = new EventListenersManager(['load','error']);

		this.on = function (event, callback) {
			listenersMgr.addEventListener(event, callback);
		};

		this.load = function (name) {
			var xhr = new XMLHttpRequest(),
				level;

			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status !== 200) {
					listenersMgr.trigger('error', "Error fetching level file.");
					return;
				}

				try {
					/**
					 * @type {JSONLevel}
					 */
					level = JSON.parse(xhr.responseText)
				} catch (e) {
					listenersMgr.trigger('error', "Error parsing level file.");
					return;
				}

				listenersMgr.trigger('load', level);
			};

			xhr.open('GET', 'levels/' + name + '.json');
			xhr.send();

		};
	};
}());