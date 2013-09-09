(function(global, undefined) {
	"use strict";

	global.CarApperance = function(type) {

		this.skin = resource.get(type);
		this.color = (['#FF0000', '#00FF00','#0000FF'])[Math.round(Math.random()*2)];

	}

	global.CarApperance.prototype.getExplosionObject = function() {
		return {
			poolSize: 200,
			spreadX: this.skin.height/2,
			spreadY: this.skin.height/2,
			minVelocity : 1,
			maxVelocity : 1,
			minGravity :  0,
			maxGravity : 0,
			minWind	   : 0,
			maxWind	   : 0,
			minSize    : 5,
			maxSize    : 80,
			minSizeStep : -50,
			maxSizeStep : -50,
			maxParticleEmit : 120,
			minParticleEmit : 150,
			minAlpha: 80,
			maxAlpha: 100,
			minVelocityRadius : 0,
			maxVelocityRadius : 360,
			minFadeStep : 1,
			maxFadeStep : 1,
			images : [ resource.get('particle_smoke'), resource.get('particle_flare'), resource.get('particle_flare_1')],
			minRotateStep : -2,
			maxRotateStep : 2
		};
	};
})(window)