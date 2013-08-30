(function(global, undefined) {
	"use strict";

	global.CarManager = function() {


		var startTiles = game.getBoard().getStartTiles(),
			endTiles = game.getBoard().getEndTiles(),
			carsTypes = ['sedan', 'truck', 'van'],
			cars = [],
			toRadians = Math.PI/180; 

		//PUBLIC

		this.addCar = function(startX, startY, endX, endY) {

			var startTile,
				endTile,
				carType = carsTypes[Math.floor(Math.random() * carsTypes.length)];
			
			if(startX !== undefined && startY !== undefined && endX !== undefined && endY !== undefined) {
				cars.push(new Car(startX, startY, endX, endY, carType))	
			} else {
				startTile = startTiles[Math.floor(Math.random() * startTiles.length)];
				endTile   = endTiles[Math.floor(Math.random() * endTiles.length)];
				cars.push(new Car(startTile._x, startTile._y, endTile._x, endTile._y, carType));
			}		
		}

		this.render = function(context) {
			var i = cars.length;

			while(i) {
				if(cars[--i].alive) {
					cars[i].drive();
					context.save();
					context.translate(cars[i].x, cars[i].y);
					context.rotate(cars[i].rotate * toRadians);
					context.drawImage(cars[i].skin, -(cars[i].width/8), -(cars[i].height/8), cars[i].width/4, cars[i].height/4);
					context.restore();
				}
			}
		}
	}

})(window)