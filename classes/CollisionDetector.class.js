(function (global, undefined) {

	global.CollisionDetector = function () {
		var pool = [];

		//debug
		//var canvas  = document.getElementById('canvas');
		//var context = canvas.getContext('2d');

		function getObjectPoints(object) {
			var radianMultiplier = Math.PI / 180,
				sizeReduce = 0,
				half_width = (object.width - sizeReduce) / 2,
				half_height = (object.height - sizeReduce) / 2,

				x_l = -half_width,  	//object x cordinate left
				x_r = half_width, 		//object x cordinate right
				y_t = -half_height, 	//object y cordinate top
				y_b = half_height, 		//object y cordinate bottom

				cos = Math.cos(object.rotate * radianMultiplier),
				sin = Math.sin(object.rotate * radianMultiplier),

				topLeft = { x: ~~((x_l * cos - y_t * sin) + object.x + 0.5),
					y: ~~((y_t * cos + x_l * sin) + object.y + 0.5) },

				topRight = { x: ~~((x_r * cos - y_t * sin) + object.x + 0.5),
					y: ~~((y_t * cos + x_r * sin) + object.y + 0.5)},

				bottomLeft = { x: ~~((x_l * cos - y_b * sin) + object.x + 0.5),
					y: ~~((y_b * cos + x_l * sin) + object.y + 0.5)},

				bottomRight = { x: ~~((x_r * cos - y_b * sin) + object.x + 0.5),
					y: ~~((y_b * cos + x_r * sin) + object.y + 0.5)};

			return { topLeft: topLeft,
				topRight: topRight,
				bottomLeft: bottomLeft,
				bottomRight: bottomRight };
		}

		function getAxes(pointObject) {

			return [
				{
					x: pointObject.topRight.x - pointObject.topLeft.x,
					y: pointObject.topRight.y - pointObject.topLeft.y },
				{
					x: pointObject.topRight.x - pointObject.bottomRight.x,
					y: pointObject.topRight.y - pointObject.bottomRight.y }
			];
		}

		function projectVectorOnAxis(axis, point) {

			var result = (point.x * axis.x + point.y * axis.y) / (axis.x * axis.x + axis.y * axis.y);

			return { x: result * axis.x,
				y: result * axis.y }
		}

		function getVactorLength(point) {
			return Math.sqrt(point.x * point.x + point.y * point.y);

		}

		function getMinMaxObjectValues(axis, pointObject, object) {
			var topLeft = projectVectorOnAxis(axis, pointObject.topLeft),
				topRight = projectVectorOnAxis(axis, pointObject.topRight),
				bottomLeft = projectVectorOnAxis(axis, pointObject.bottomLeft),
				bottomRight = projectVectorOnAxis(axis, pointObject.bottomRight),

				// values = [ topLeft.x * axis.x + topLeft.y * axis.y,
				// 	topRight.x * axis.x + topRight.y * axis.y,
				// 	bottomLeft.x * axis.x + bottomLeft.y * axis.y,
				// 	bottomRight.x * axis.x + bottomRight.y * axis.y
				// ];

			//--------------------------------------------------//
			//change to scalar values by implement dot project  //
			//--------------------------------------------------//
				values = [getVactorLength(topLeft), getVactorLength(topRight), getVactorLength(bottomLeft), getVactorLength(bottomRight)];

			//helpers
			//drawLine([{x:0, y:0}, topLeft], '#C0C0C0', 3, 5, 5);
			//drawLine([{x:0, y:0}, bottomRight], '#C0C0C0', 3, 5, 5);

			//line itself
			//drawLine([topLeft, topRight, bottomLeft, bottomRight], object.color, 6, 5, 5);

			values.sort();

			return { min: values[0],
					 max: values[3] }
		}

		function drawLine(points, color, width, startX, startY) {
			if(!points.length) {
				return;
			}

			color = color   || '#000000';
			startX = startX || 0;
			startY = startY || 0;
			width = width   || 3;

			context.beginPath();
			context.moveTo(startX +points[0].x, startY +points[0].y);

			points.forEach(function(point) {
				context.lineTo(startX + point.x, startY + point.y);
			});
			
			context.lineWidth = width;
			context.strokeStyle = color;
			context.stroke();
		}

		function drawDot(x, y) {
			var canvas = document.getElementById('canvas');
			var context = canvas.getContext('2d');
			context.fillStyle = '#800000'; // blue
			context.fillRect(x + canvas.height, y + canvas.height, 10, 10);
		}

		function isOverlap(objectOneValues, objectTwoValues) {
			return objectTwoValues.min <= objectOneValues.max && objectTwoValues.max >= objectOneValues.min;
		}

		function isCollision(objectOne, objectTwo) {
			var a = getObjectPoints(objectOne),
				b = getObjectPoints(objectTwo),

				aAxes = getAxes(a),
				bAxes = getAxes(b),

				allAxes = [aAxes[0], aAxes[1], bAxes[0], bAxes[1]],
				i = allAxes.length;


			// drawLine([{x:0,y:0}, aAxes[0]], objectOne.color, 3, objectOne.x, objectOne.y);
			// drawLine([{x:0,y:0}, aAxes[1]], objectOne.color, 3, objectOne.x, objectOne.y);
			// drawLine([{x:0,y:0}, bAxes[0]], objectTwo.color, 3, objectTwo.x, objectTwo.y);
			// drawLine([{x:0,y:0}, bAxes[1]], objectTwo.color, 3, objectTwo.x, objectTwo.y);

			//console.log(aAxes[0], aAxes[1], a, objectOne);

			while (i--) {


				var aValues = getMinMaxObjectValues(allAxes[i], a, objectOne);
				var bValues = getMinMaxObjectValues(allAxes[i], b, objectTwo);

				if (!isOverlap(aValues, bValues)) {
					return false;

				}
			}

			return true;
		}

		this.addObject = function (object) {
			pool.push(object);
		};

		this.removeObject = function (object) {
			var i = pool.length;

			while (i--) {
				if (object === pool[i]) {
					pool.splice(i, 1);
				}
			}
		};

		this.checkCollisions = function () {
			var i, j, objectOne, objectTwo;
			i = j = pool.length;

			while (i--) {
				j = i;
				while (j--) {
					objectOne = pool[i];
					objectTwo = pool[j];

					if (isCollision(objectOne, objectTwo)) {
						objectOne.collision(objectTwo);
						objectTwo.collision(objectOne);
					} 
				}
			}
		};

		this.debugPoints = function (context, object) {
			var point = getObjectPoints(object);

			context.fillStyle = '#00f'; // blue
			context.fillRect(point.topLeft.x, point.topLeft.y, 3, 3);
			context.fillRect(point.topRight.x, point.topRight.y, 3, 3);
			context.fillRect(point.bottomLeft.x, point.bottomLeft.y, 3, 3);
			context.fillRect(point.bottomRight.x, point.bottomRight.y, 3, 3);
		}


	}
})(window);