(function () {

	window.CollisionDetector = function () {
		var pool = [];

		function getObjectPoints(object) {
			var radianMultiplier = Math.PI / 180,
				sizeReduce = 0,
				half_width = (object.width - sizeReduce) / 2,
				half_height = (object.height - sizeReduce) / 2,

				x_l = -half_width,  	//object x cordinate left
				y_t = -half_height, 	//object y cordinate top
				cos = Math.cos(object.rotate * radianMultiplier),
				sin = Math.sin(object.rotate * radianMultiplier),

				topLeft = { x: ~~((x_l * cos - y_t * sin) + object.x + 0.5),
					y: ~~((y_t * cos + x_l * sin) + object.y + 0.5) },

				topRight = { x: ~~((half_width * cos - y_t * sin) + object.x + 0.5),
					y: ~~((y_t * cos + half_width * sin) + object.y + 0.5)},

				bottomLeft = { x: ~~((x_l * cos - half_height * sin) + object.x + 0.5),
					y: ~~((half_height * cos + x_l * sin) + object.y + 0.5)},

				bottomRight = { x: ~~((half_width * cos - half_height * sin) + object.x + 0.5),
					y: ~~((half_height * cos + half_width * sin) + object.y + 0.5)};

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

				values = [getVactorLength(topLeft), getVactorLength(topRight), getVactorLength(bottomLeft), getVactorLength(bottomRight)];


			values.sort();

			return { min: values[0],
					 max: values[3] }
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

	}
})();