(function(global, undefined) {
	
	global.Car = function(options) {
		
		this.alive 	= true;
		this.x 	   	= 0;
		this.y 	   	= 0;
		this.rotate = 0;

		//TODO: create asset manager;
		this.skin = document.createElement('img');
		//this.width = this.skin.width;
		//this.height = this.skin.height;
		this.width = 175;
		this.height = 84;

		this.skin.src = 'gfx/' + options.type + '.png';

		this._t 	   = 0.0;	
		this._velocity = 0.02;

		this._board 	  = options.board;
		this._currentTile = options.board.getTile(options.startTileX, options.startTileY);
		this._prevTile 	  = this._currentTile;
		
		this._endTileX = options.endTileX;
		this._endTileY = options.endTileY;

		this._p0 = { x : 0, y : 0 };
		this._p1 = { x : 0, y : 0 };
		this._p2 = { x : 0, y : 0 };
		this._p3 = { x : 0, y : 0 };

		this._ax = 0;
		this._ay = 0;
		this._bx = 0;
		this._by = 0;
		this._cx = 0;
		this._cy = 0;

		this._initialDirection = 'w';
		this._endDirection 	   = 'e';

		this._updateDirections();
		this._updateRoadPoints();
		this._updateBezierValues();
	}

	global.Car.prototype._updateDirections = function() {
		var n = this._currentTile.hasNorthRoad(),
			s = this._currentTile.hasSouthRoad(),
			e = this._currentTile.hasEastRoad(),
			w = this._currentTile.hasWestRoad();

		if(this._prevTile === this._currentTile) { //first tile

		} else {
			if( n && s && !w && !e ) { //stright - vertical
				if(this._endDirection === 'n') {
					this._initialDirection = 's';
				} else {
					this._initialDirection = 's';
					this._endDirection = 'n';
				}
			} else if ( w && e && !n && !s ) { //stright - horizontal
				if(this._endDirection === 'w') {
					this._initialDirection = 'e';
				} else {
					this._initialDirection = 'w';
					this._endDirection = 'e';
				}
			} else if ( w && !e && n && !s ) { //turn - west north
				if(this._endDirection === 's') {
					this._initialDirection = 'n';
					this._endDirection = 'w';
				} else {
					this._initialDirection = 'w';
					this._endDirection = 'n';
				}
			} else if ( w && !e && !n && s ) { //turn - west south
				if(this._endDirection === 'e') {
					this._initialDirection = 'w';
					this._endDirection = 's'
				} else {
					this._initialDirection = 's';
					this._endDirection = 'w';
				}
			} else if( !w && e && n && !s ) { //turn - east north
				if(this._endDirection === 's') {
					this._initialDirection = 'n';
					this._endDirection = 'e';
				} else {
					this._initialDirection = 'e';
					this._endDirection = 'n';
				}
			} else if( !w && e && !n && s ) { //turn - east south
				if(this._endDirection === 'n') {
					this._initialDirection = 's';
					this._endDirection = 'e';
				} else {
					this._initialDirection = 'e';
					this._endDirection = 's';
				}
			}
		}

	};

	global.Car.prototype._updateRoadPoints = function(tileSize) {
		var n = this._currentTile.hasNorthRoad(),
			s = this._currentTile.hasSouthRoad(),
			e = this._currentTile.hasEastRoad(),
			w = this._currentTile.hasWestRoad(),

			offsetX = this._currentTile.getX() * tileSize,
			offsetY = this._currentTile.getY() * tileSize;

		if( n && s && !w && !e ) {  //stright - vertical

			this._p0.x = this._p1.x = this._p2.x = this._p3.x = offsetX + tileSize/2;
			
			if(this._initialDirection === 'n') { //start from north
				this._p0.y = offsetY;
				this._p1.y = offsetY + tileSize / 4;
				this._p2.y = offsetY + tileSize / 4 * 3; 
				this._p3.y = offsetY + tileSize - 1;
			} else {
				this._p0.y = offsetY + tileSize - 1;
				this._p1.y = offsetY + tileSize / 4 * 3;
				this._p2.y = offsetY + tileSize / 4;
				this._p3.y = offsetY;
			}

		} else if( w && e && !n && !s ) { //stright - horizontal

			this._p0.y = this._p1.y = this._p2.y = this._p3.y = offsetY + tileSize/2;

			if (this._initialDirection === 'w') { //start from west
				this._p0.x = offsetX;
				this._p1.x = offsetX + tileSize / 4;
				this._p2.x = offsetX + tileSize / 4 * 3; 
				this._p3.x = offsetX + tileSize - 1;
			} else {
				this._p0.x = offsetX + tileSize - 1;
				this._p1.x = offsetX + tileSize / 4 * 3; 
				this._p2.x = offsetX + tileSize / 4;
				this._p3.x = offsetX;
			}
			

		} else if( w && !e && n && !s ) { //turn - west north

			if (this._initialDirection === 'w') { //start from west		
				this._p0.y = this._p1.y = offsetY + tileSize / 2;
				this._p2.x = this._p3.x = offsetX + tileSize / 2;

				this._p0.x = offsetX;
				this._p1.x = offsetX + tileSize / 2;
				this._p2.y = offsetY + tileSize / 2;
				this._p3.y = offsetY;
			} else {
				this._p0.x = this._p1.x = offsetX + tileSize / 2;
				this._p2.y = this._p3.y = offsetY + tileSize / 2;

				this._p0.y = offsetY;
				this._p1.y = offsetY + tileSize / 2;
				this._p2.x = offsetX + tileSize / 2;
				this._p3.x = offsetX;
			}

		} else if( w && !e && !n && s ) { //turn - west south

			if (this._initialDirection === 'w') { //start from west		
				this._p0.y = this._p1.y = offsetY + tileSize / 2;
				this._p2.x = this._p3.x = offsetX + tileSize / 2;

				this._p0.x = offsetX;
				this._p1.x = offsetX + tileSize / 2;
				this._p2.y = offsetY + tileSize / 2;
				this._p3.y = offsetY + tileSize - 1;
			} else {
				this._p0.x = this._p1.x = offsetX + tileSize / 2;
				this._p2.y = this._p3.y = offsetY + tileSize / 2;

				this._p0.y = offsetY + tileSize - 1;
				this._p1.y = offsetY + tileSize / 2;
				this._p2.x = offsetX + tileSize / 2;
				this._p3.x = offsetX;
			}

		} else if( !w && e && n && !s ) { //turn - east north

			if(this._initialDirection === 'e') { // start from east
				this._p0.y = this._p1.y = offsetY + tileSize / 2;
				this._p2.x = this._p3.x = offsetX + tileSize / 2;

				this._p0.x = offsetX + tileSize - 1;
				this._p1.x = offsetX + tileSize / 2;
				this._p2.y = offsetY + tileSize / 2;
				this._p3.y = offsetY;
			} else {
				this._p0.x = this._p1.x = offsetX + tileSize / 2;
				this._p2.y = this._p3.y = offsetY + tileSize / 2;

				this._p0.y = offsetY;
				this._p1.y = offsetY + tileSize / 2;
				this._p2.x = offsetX + tileSize / 2;
				this._p3.x = offsetX + tileSize - 1;
			}

		} else if( !w && e && !n && s ) { //turn - east south
			
			if(this._initialDirection === 'e') { // start from east
				this._p0.y = this._p1.y = offsetY + tileSize / 2;
				this._p2.x = this._p3.x = offsetX + tileSize / 2;

				this._p0.x = offsetX + tileSize - 1;
				this._p1.x = offsetX + tileSize / 2;
				this._p2.y = offsetY + tileSize / 2;
				this._p3.y = offsetY + tileSize - 1;
			} else {
				this._p0.x = this._p1.x = offsetX + tileSize / 2;
				this._p2.y = this._p3.y = offsetY + tileSize / 2;

				this._p0.y = offsetY + tileSize - 1;
				this._p1.y = offsetY + tileSize / 2;
				this._p2.x = offsetX + tileSize / 2;
				this._p3.x = offsetX + tileSize - 1;
			}
		}
	}

	global.Car.prototype._updateBezierValues = function() {
		this._cx = 3 * (this._p1.x - this._p0.x);
		this._bx = 3 * (this._p2.x - this._p1.x) - this._cx;
		this._ax = this._p3.x - this._p0.x - this._cx - this._bx;

		this._cy = 3 * (this._p1.y - this._p0.y);
		this._by = 3 * (this._p2.y - this._p1.y) - this._cy;
		this._ay = this._p3.y - this._p0.y - this._cy - this._by;
	}

	global.Car.prototype._updateRotation = function() {

		var nextT = this._t + 0.2,
			nextX = this._getX(nextT),
			nextY = this._getY(nextT),
			deltaY = nextY - this.y,
			deltaX = nextX - this.x;
			
			if(nextT <= 1) {
				this.rotate = Math.floor(Math.atan2(deltaY,deltaX) * 180 / Math.PI);
			}			
	}

	global.Car.prototype._getX = function(t) {
		return Math.floor(this._ax * (t * t * t) + this._bx * (t * t) + this._cx * (t) + this._p0.x);
	}

	global.Car.prototype._getY = function(t) {
		return Math.floor(this._ay * (t * t * t) + this._by * (t * t) + this._cy * (t) + this._p0.y);
	}

	global.Car.prototype._crash = function() {
		game.carLost();
		this.alive = false;
	}

	global.Car.prototype.drive = function(tileSize) {
		var nextX, 
			nextY;

		if(this._t > 1) {
			this._t = 0.0;

			if(this._currentTile.getX() === this.endTileX && this._currentTile.getY() === this.endTileY) { 
				game.carWon();
				this.alive = false;
				return;
			}

			this._prevTile = this._currentTile;

			switch(this._endDirection) { //get new Tile and check colision
				case 'w':
					nextX = this._currentTile.getX() - 1;
					nextY = this._currentTile.getY();

					if(nextX >= this._board.getWidth() || nextX < 0 || nextY >= this._board.getHeight() || nextY < 0) {
						this._crash();
						return
					}

					this._currentTile = this._board.getTile(nextX, nextY);
					if(!this._currentTile.hasEastRoad()) {
						this._crash();
						return;
					}
					break;
				case 'n':
					nextX = this._currentTile.getX();
					nextY = this._currentTile.getY() - 1;

					if(nextX >= this._board.getWidth() || nextX < 0 || nextY >= this._board.getHeight() || nextY < 0) {
						this._crash();
						return
					}

					this._currentTile = this._board.getTile(nextX, nextY);
					if(!this._currentTile.hasSouthRoad()) {
						this._crash();
						return;
					}
					break;
				case 'e':
					nextX = this._currentTile.getX() + 1;
					nextY = this._currentTile.getY();

					if(nextX >= this._board.getWidth() || nextX < 0 || nextY >= this._board.getHeight() || nextY < 0) {
						this._crash();
						return
					}
					this._currentTile = this._board.getTile(nextX, nextY);
					if(!this._currentTile.hasWestRoad()) {
						this._crash();
						return;
					}
					break;
				case 's':
					nextX = this._currentTile.getX();
					nextY = this._currentTile.getY() + 1;

					if(nextX >= this._board.getWidth() || nextX < 0 || nextY >= this._board.getHeight() || nextY < 0) {
						this._crash();
						return
					}
					this._currentTile = this._board.getTile(nextX, nextY);
					if(!this._currentTile.hasNorthRoad()) {
						this._crash();
						return;
					}
					break;
			}
			
			if(!this._prevTile.isStart()) {
				this._prevTile.unlock();
			}

			this._currentTile.lock();
			this._updateDirections();
			this._updateRoadPoints(tileSize); 
			this._updateBezierValues();
		}


		this.x = this._getX(this._t);
		this.y = this._getY(this._t);
		this._updateRotation();

		this._t += this._velocity;
		//this.velocity *= 1.01;
	}
})(window);