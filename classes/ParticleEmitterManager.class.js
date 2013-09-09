(function(global, undefined) {
	"use strict";

	global.ParticleEmitterManager = function(game) {


		var _emitters = [];

		//PUBLIC
		this.addEmitter = function(options) {
			var particleEmitter = new jEmitter.ParticleEmitter(options);

			_emitters[_emitters.length] = particleEmitter;

			return particleEmitter;
		};

		this.render = function(context) {
			var i = _emitters.length;
			context.save();
			context.globalCompositeOperation = 'lighter';
			while(i--) {	
				_emitters[i].render(context);
			}
			context.restore();
		};
	}
})(window)