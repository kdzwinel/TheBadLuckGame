(function(global, undefined) {
	"use strict";

	global.CarManager = function(game) {


		var _board      = game.getBoard(),
            _startTiles = _board.getStartTiles(),
			_endTiles   = _board.getEndTiles(),
			_carsTypes  = ['sedan', 'truck', 'van'],
			_cars       = [],
			_toRadians  = Math.PI/180;

		function _removeCar(carReference) {
			var i = _cars.length;

			while(i--) {
				if(carReference === _cars[i]) {
					_cars.splice(i,1);	
				}
			}
		}

		function _carLost(carReference) {
			_removeCar(carReference);
			 game.carLost();
		}

		function _carTripEnd(carReference) {
			_removeCar(carReference);
			game.carWon();
		}

		//PUBLIC

		this.addCar = function(options) {

			var options   = options || {},
                startTile = _startTiles[Math.floor(Math.random() * _startTiles.length)],
				endTile   = _endTiles[Math.floor(Math.random() * _endTiles.length)],
				carType   = _carsTypes[Math.floor(Math.random() * _carsTypes.length)],

                startX    = options.startX || startTile.getX(),
                startY    = options.startY || startTile.getY(),
                endX      = options.endX   || endTile.getX(),
                endY      = options.endY   || endTile.getY(),
                
                car = new Car({
                	startTileX : startX,
	                startTileY : startY,
	                endTileX   : endX,
	                endTileY   : endY,
	                type       : carType,
	                board      : _board,
	                tileSize   : 200
	            });

	        car.on('crash', _carLost);
	        car.on('trip-end', _carTripEnd);       

            _cars.push(car);
            return car;

		};

		this.render = function(context) {
			var i = _cars.length;

			while(i--) {	
				context.save();
				context.translate(_cars[i].x, _cars[i].y);
				context.rotate(_cars[i].rotate * _toRadians);
				context.drawImage(_cars[i].skin, -(_cars[i].width/2), -(_cars[i].height/2), _cars[i].width, _cars[i].height);
				context.restore();
			}
		};

		this.step = function(tileSize) {
			var i = _cars.length;

			while(i--) {
				_cars[i].drive(tileSize);	
			}
		};
	}

})(window);