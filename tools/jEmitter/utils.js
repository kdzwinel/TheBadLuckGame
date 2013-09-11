var jEmitter = jEmitter || {};

(function (o, undefined) {
	'use strict';

	o.utils = {
		random: function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		hexToRgb: function (hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		}
	};
})(jEmitter);