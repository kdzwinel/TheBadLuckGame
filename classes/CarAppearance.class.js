(function (global, undefined) {
	"use strict";

	global.CarApperance = function () {
		var canvas, context, img;

		canvas = document.createElement('canvas');
		canvas.width = 50;
		canvas.height = 30;
		context = canvas.getContext('2d');

		context.fillStyle = '#BEBEBE';
		context.fillRect(0,0,10,5);
		context.fillRect(40,0,10,5);
		context.fillRect(0,25,10,5);
		context.fillRect(40,25,10,5);

		context.fillStyle = '#77B88B';
		context.rect(0,5,50,20);

		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.stroke();

		img = document.createElement('img');
		img.setAttribute('src', canvas.toDataURL());
		this.skin = img;
	};

})(window);