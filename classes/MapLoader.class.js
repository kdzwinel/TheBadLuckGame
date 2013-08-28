/**
 * JSON level definition.
 *
 * @class JSONLevel
 * @property {number} carCount number of cars that will be deployed
 * @property {number} carTimeout number of ms between each car is deployed
 * @property {number} startTimeout number of ms before game is started
 * @property {number} carsToWin number of cars that need to reach the ending tile to win the game
 * @property {JSONMap} map
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
 * JSON tile definition.
 *
 * @class JSONTile
 * @property {Object} road
 * @property {boolean} start
 * @property {boolean} end
 * @property {boolean} locked
 */

(function () {
	"use strict";

	window.MapLoader = function () {
		var listeners = {
			'load': [],
			'error': []
		};

		function trigger(event, data) {
			if (listeners[event] === undefined) {
				throw 'Unknown event "' + event + '"';
			}

			for (var i = 0, l = listeners[event].length; i < l; i++) {
				listeners[event][i](data);
			}
		}

		this.on = function (event, callback) {
			if (listeners[event] === undefined) {
				throw 'Unknown event "' + event + '"';
			}

			if (typeof callback !== "function") {
				throw 'Second argument must be a function.';
			}

			listeners[event].push(callback);
		};

		this.load = function (name) {
			var xhr = new XMLHttpRequest(),
				level;

			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status !== 200) {
					trigger('error', "Error fetching level file.");
					return;
				}

				try {
					/**
					 * @type {JSONLevel}
					 */
					level = JSON.parse(xhr.responseText)
				} catch (e) {
					trigger('error', "Error parsing level file.");
					return;
				}

				trigger('load', level);
			};

			xhr.open('GET', 'levels/' + name + '.json');
			xhr.send();

		};
	};
}());