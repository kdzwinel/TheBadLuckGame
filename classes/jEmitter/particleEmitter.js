var jEmitter = jEmitter || {};

(function(o, undefined) {
'use strict';

	o.ParticleEmitter = function(settings) {
		if(!(this instanceof o.ParticleEmitter)) {
			return new o.ParticleEmitter(settings);
		}

		settings = settings || {};
		this.particles = [];
		this.pool 	   = [];

		this.poolSize 		    = settings.poolSize			 || 250;
		this.maxParticleEmit	= settings.maxParticleEmit 	 || 4;
		this.minParticleEmit	= settings.minParticleEmit 	 || 1;
		this.maxSize 			= settings.maxSize 		   	 || 1;
		this.minSize 			= settings.minSize 		   	 || 5;
		this.maxSizeStep		= settings.maxSizeStep		 ||	0;
		this.minSizeStep		= settings.minSizeStep		 || 0;
		this.maxGravity 		= settings.maxGravity 	   	 || 0;
		this.minGravity 		= settings.minGravity 	   	 || 0;
		this.maxWind 			= settings.maxWind 	   	   	 || 0;
		this.minWind 			= settings.minWind 	   	   	 || 0;
		this.spreadX 			= settings.spreadX 		   	 || 0;
		this.spreadY 			= settings.spreadY 		   	 || 0;
		this.minVelocity		= settings.minVelocity	   	 || 3;
		this.maxVelocity		= settings.maxVelocity	   	 || 5;
		this.minVelocityRadius	= settings.minVelocityRadius || 0;
		this.maxVelocityRadius	= settings.maxVelocityRadius || 360;
		this.equalRadius		= settings.equalRadius		 || false;
		this.minRotateStep		= settings.minRotateStep	 || 0;
		this.maxRotateStep		= settings.maxRotateStep	 || 0;
		this.colors				= settings.colors			 || ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423'];
		this.minAlpha			= settings.minAlpha			 || 100;
		this.maxAlpha			= settings.maxAlpha			 || 100;
		this.minFadeStep		= settings.minFadeStep		 || 0;
		this.maxFadeStep		= settings.maxFadeStep		 || 0;
		this.images 			= settings.images;

		this.TWO_PI   = 2 * Math.PI;		
		this.RAD_CONS = Math.PI/180;
	}

	o.ParticleEmitter.prototype.emit = function(x, y) {
		
		var random = o.utils.random,
			max = random(this.minParticleEmit, this.maxParticleEmit),
			particle,
			size,
			sizeStep,
			gravity,
			wind,
			positionX,
			positionY,
			color,
			alpha,
			fadeStep,
			rotateStep,
			velocity,
			velocityRadius,
			radians,
			velocityX,
			velocityY,
			image;
		
		for (var i = 0; i < max; i++ ) {

				size   	   = random(this.minSize, this.maxSize);
				sizeStep   = random(this.minSizeStep, this.maxSizeStep)/100;
				gravity    = random(this.minGravity, this.maxGravity)/100;
				wind 	   = random(this.minWind, this.maxWind)/100;
				positionX  = random(x-this.spreadX, x + this.spreadX);
				positionY  = random(y-this.spreadY, y + this.spreadY);
				color 	   = this.colors[Math.floor((Math.random() * this.colors.length))];
				alpha 	   = random(this.minAlpha, this.maxAlpha)/100;
				fadeStep   = random(this.minFadeStep, this.maxFadeStep)/100;
				rotateStep = random(this.minRotateStep, this.maxRotateStep);
				velocity   = random(this.minVelocity, this.maxVelocity);

				if(this.images) {
					image = this.images[Math.floor((Math.random() * this.images.length))];
				}

				 if(this.equalRadius) {
				 	velocityRadius = this.minVelocityRadius + (((this.maxVelocityRadius - this.minVelocityRadius) / (max)) * i);
					console.log(max, velocityRadius);
				 } else {
				 	velocityRadius = random(this.minVelocityRadius, this.maxVelocityRadius);
				 }
							
				radians   	   = (velocityRadius + 90) * (this.RAD_CONS);
				velocityX 	   = Math.sin(radians) * velocity;
				velocityY 	   = Math.cos(radians) * velocity;

			if(this.particles.length >= this.poolSize) {
				this.pool.push(this.particles.shift());
			}

			if(this.pool.length) {
				particle = this.pool.pop();
				particle.init(positionX, 
					positionY, 
					velocityX, 
					velocityY, {
						size 	 	: size,
						sizeStep 	: sizeStep,
						gravity  	: gravity,
						wind 	 	: wind, 
						color 	 	: color,
						alpha	 	: alpha,
						fadeStep 	: fadeStep,
						rotateStep : rotateStep,
						image      : image
					});
			} else {
				particle = new o.Particle(
					positionX, 
					positionY, 
					velocityX, 
					velocityY, {
						size 	   : size,
						sizeStep   : sizeStep,
						gravity    : gravity,
						wind 	   : wind, 
						color	   : color,
						alpha	   : alpha,
						fadeStep   : fadeStep,
						rotateStep : rotateStep,
						image      : image
					});
			}

            this.particles.push(particle);
        }

	}

	o.ParticleEmitter.prototype.update = function() {
		for(var i = this.particles.length-1; i >= 0; i--) {
			if(this.particles[i].alive) {
				this.particles[i].move();	
			} else {
				this.pool.push(this.particles.splice(i,1)[0])
			}
		}
	}

	o.ParticleEmitter.prototype.draw = function(ctx, j) {
		var particle = this.particles[j],
			halfSize = particle.size/2;

		ctx.save();
		ctx.globalAlpha = particle.alpha;
		ctx.translate(particle.position.x, particle.position.y)
		ctx.rotate(particle.rotateAngle * this.RAD_CONS);
		if(!this.images) {
				ctx.beginPath();
				ctx.arc(-halfSize,
						-halfSize,
						particle.size,
						0,
						this.TWO_PI);
		
			ctx.fillStyle = particle.color;
			ctx.fill();	
		} else {
			ctx.drawImage(particle.image,
						  -halfSize,
						  -halfSize, 
						  particle.size, 
						  particle.size);
		}
		ctx.restore();
	}

	o.ParticleEmitter.prototype.render = function(ctx) {

		this.update();

		for(var i = this.particles.length-1; i > -1; i--) {
			this.draw(ctx, i);
		}
	}



})(jEmitter)