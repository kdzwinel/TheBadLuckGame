(function(global, undefined) {
	"use strict";

	global.ParticleEmitterManager = function(game) {


		var _board      = game.getBoard(),
            _startTiles = _board.getStartTiles(),
			_endTiles   = _board.getEndTiles(),
			_carsTypes  = ['sedan', 'truck', 'van'],
			_cars       = [],
			_toRadians  = Math.PI/180;

		
		//PUBLIC
		this.addEmitter = function(options) {
			
			
		};

		this.render = function(context) {
			var i = _emitters.length;

			while(i--) {	
				_emitters[i].render(context);
			}
		};