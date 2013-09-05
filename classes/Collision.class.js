(function(global, undefined) {
	
	global.Collision = function(game) {
		var pool = [];

		function getObjectPoints(object) {
			var radianMultiplier = Math.PI / 180,

				half_width  = object.width / 2,
				half_height = object.height / 2,

				x_l = - half_width, //object.x - half_width, 		//object x cordinate left
				x_r = half_width, //object.x + half_width,		//object x cordinate right
				y_t = - half_height, //object.y - half_height,		//object y cordinate top
				y_b = half_height, //object.y + half_height,		//object y cordinate bottom

				cos = Math.cos(object.rotate * radianMultiplier),
				sin = Math.sin(object.rotate * radianMultiplier),


				topLeft 	= { x: (x_l * cos - y_t * sin) + object.x, 
								y: (y_t * cos + x_l * sin) + object.y }, 

				topRight 	= { x: (x_r * cos - y_t * sin) + object.x, 
								y: (y_t * cos + x_r * sin) + object.y },

				bottomLeft 	= { x: (x_l * cos - y_b * sin) + object.x, 
								y: (y_b * cos + x_l * sin) + object.y },

				bottomRight = { x: (x_r * cos - y_b * sin) + object.x,
							    y: (y_b * cos + x_r * sin) + object.y };

				return { topLeft	: topLeft,
						 topRight	: topRight,
						 bottomLeft	: bottomLeft,
						 bottomRight: bottomRight
						};
		}

		function isCollision(objectOne, objectTwo) {
			var a = getObjectPoints(objectOne),
				b = getObjectPoints(objectTwo);


				// axis_1 = { x: , y: },
				// axis_2 = { x: , y: },
				// axis_3 = { x: , y: },
				// axis_4 = { x: , y: };

				// axis1.x = A.UR.x - A.UL.x
				// axis1.y = A.UR.y - A.UL.y
				// axis2.x = A.UR.x - A.LR.x
				// axis2.y = A.UR.y - A.LR.y
				// axis3.x = B.UL.x - B.LL.x
				// axis3.y = B.UL.y - B.LL.y
				// axis4.x = B.UL.x - B.UR.x
				// axis4.y = B.UL.y - B.UR.y
			//firstly check radius collision 
			//if radius collision check more carefully.
		}

		this.addObject = function(object) {
			pool.push(object);
		}

		this.removeObject = function(object) {
			var i = pool.length

			while(i--) {
				if(object === pool[i]) {
					pool.splice(i,1);	
				}
			}
		}

		this.checkCollisions = function() {
			var i = j = pool.length,
				object_one, object_two;

			while (i--) {
				j = i;
				while (j--) {
					object_one = pool[i];
					object_two = pool[j];

					if (isCollision(object_one, object_two)) {
						object_one.collision();
						object_two.collision();
						this.removeObject(object_one);
						this.removeObject(object_two);
					}	
				}
			}			
		}

		this.debugPoints = function(context, object) {
			var point = getObjectPoints(object);

			context.fillStyle = '#00f'; // blue
			context.fillRect(point.topLeft.x, point.topLeft.y, 3, 3);
			context.fillRect(point.topRight.x, point.topRight.y, 3, 3);
			context.fillRect(point.bottomLeft.x, point.bottomLeft.y, 3, 3);
			context.fillRect(point.bottomRight.x, point.bottomRight.y, 3, 3);
		}


	}
})(window)