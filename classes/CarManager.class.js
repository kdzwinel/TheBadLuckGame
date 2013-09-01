(function(global, undefined) {
	"use strict";

	global.CarManager = function(game) {


		var _board      = game.getBoard(),
            _startTiles = _board.getStartTiles(),
			_endTiles   = _board.getEndTiles(),
			_carsTypes  = ['sedan', 'truck', 'van'],
			_cars       = [],
			_toRadians  = Math.PI/180;

		//PUBLIC

		this.addCar = function(options) {

			var options   = options || {},
                startTile = _startTiles[Math.floor(Math.random() * _startTiles.length)],
				endTile   = _endTiles[Math.floor(Math.random() * _endTiles.length)],
				carType   = _carsTypes[Math.floor(Math.random() * _carsTypes.length)],

                startX    = options.startX || startTile.getX(),
                startY    = options.startY || startTile.getY(),
                endX      = options.endX || endTile.getX(),
                endY      = options.endY || endTile.getY();

            _cars.push(new Car({startTileX : startX,
                startTileY : startY,
                endTileX   : endX,
                endTileY   : endY,
                type       : carType,
                board      : _board,
                tileSize   : 200}));

		};

		this.render = function(context) {
			var i = _cars.length;

			while(i) {
				if(_cars[--i].alive) {
					context.save();
					context.translate(_cars[i].x, _cars[i].y);
					context.rotate(_cars[i].rotate * _toRadians);
					context.drawImage(_cars[i].skin, -(_cars[i].width/8), -(_cars[i].height/8), _cars[i].width/4, _cars[i].height/4);
					context.restore();
				}
			}
		};

		this.step = function(tileSize) {
			var i = _cars.length;

			while(i) {
				if(_cars[--i].alive) {
					_cars[i].drive(tileSize);
				}
			}
		};
	}

})(window)