var jEmitter = jEmitter || {};

(function(o, undefined) {
'use strict';

	o.Particle = function(x, y, vx, vy, settings) {
		if(!(this instanceof o.Particle)) {
			return new o.Particle(x, y, vx, vy, settings);
		}

		this.init(x,y,vx,vy, settings);	
	}

	o.Particle.prototype.init = function(x, y, vx, vy, settings) {

		if(!this.position) {
			this.position = new o.Vector(x, y);
			this.velocity = new o.Vector(vx, vy);
		} else {
			this.position.x = x;
			this.position.y = y;
			this.velocity.x = vx;
			this.velocity.y = vy;
		}

		this.size	  	 = settings.size 	   || 15;
		this.sizeStep 	 = settings.sizeStep   || 0;
		this.gravity  	 = settings.gravity    || 0;	
		this.wind 	  	 = settings.wind 	   || 0;
		this.color    	 = settings.color      || '#000000';
		this.alpha	  	 = settings.alpha	   || 1;
		this.fadeStep 	 = settings.fadeStep   || 0;
		this.rotateStep  = settings.rotateStep || 0;
		this.rotateAngle = 0;
		this.alive 	  	 = true;
	}

	o.Particle.prototype.move = function() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.velocity.x += this.wind;
		this.velocity.y += this.gravity;

		this.alpha -= this.fadeStep;

		this.size += this.sizeStep;

		this.rotateAngle += this.rotateStep;

		if(this.size < 1 || this.alpha < 0.1) {
			this.alive = false;
		}
	}
})(jEmitter);