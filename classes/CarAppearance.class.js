(function (global, undefined) {
	"use strict";

	global.CarApperance = function () {
		var canvas, context, img;

		canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 33;
		context = canvas.getContext('2d');

		context.beginPath();
		context.rect(0,0,100,33);
		context.fillStyle = 'yellow';
		context.fill();
		context.lineWidth = 7;
		context.strokeStyle = 'black';
		context.stroke();

		img = document.createElement('img');
		img.setAttribute('src', canvas.toDataURL());
		this.skin = img;
	};

})(window);