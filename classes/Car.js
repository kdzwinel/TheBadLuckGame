(function() {
	window.Car = function(){
		
		function init() {
			this.x = 0;
			this.y = 0;

			this.width = 300;
			this.height = 200;
			this.rotate = 0;

			this.t = 0;	
			this.velocity = 0.1;
			updateBezierValues(0,0);
		}

		function updateBezierValues(x, y){
			//TODO: get cell from board and switch points to pixels values

			this.p0 = { x: 0; y:0 }; //start point
			this.p1 = { x: 0; y:0 };
			this.p2 = { x: 0; y:0 };
			this.p3 = { x: 0; y:0 }; //end point

			this.cx = 3 * (this.p1.x - this.p0.x)
			this.bx = 3 * (this.p2.x - this.p1.x) - this.cx;
			this.ax = this.p3.x - this.p0.x - this.cx - this.bx;

			this.cy = 3 * (this.p1.y - this.p0.y);
			this.by = 3 * (this.p2.y - this.p1.y) - this.cy;
			this.ay = this.p3.y - this.p0.y - this.cy - this.by;
		}

		//PUBLIC//
		this.drive = function() {

			var t  = this.t;

			this.x = this.ax * (t * t * t) + this.bx * (t * t) + this.cx * (t) + this.x0;
			this.y = this.ay * (t * t * t) + this.by * (t * t) + this.cy * (t) + this.y0;

			this.t += this.velocity;

			if(this.t>1) {
				this.t = 0;
			}

			//TODO: add border conditions, collisions etc.
		}


	}
})()