(function (global, undefined) {
	"use strict";

	global.CarApperance = function (type) {

		this.skin = resource.get(type);
	};

})(window);