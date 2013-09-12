(function(global, undefined) {
	
	global.Car = function(options) {
		
		this.x 	   	= -100;
		this.y 	   	= -100;
		this.rotate = 0;
		this.alive  = true;

		this.appearance = options.appearance;
		this.width = this.appearance.skin.width;
		this.height = this.appearance.skin.height;

		this._t 	   = 0.0;
		this._velocity = options.velocity;

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

		this._initialDirection = '';
		this._endDirection 	   = '';

		this._listenersMgr = new EventListenersManager(['crash', 'trip-end']);
	};

	/**
	 * Allows listening to predefined events (lock, unlock, rotate)
	 * @param {string} event
	 * @param {function} callback
	 */
	global.Car.prototype.on = function(event, callback) {
		this._listenersMgr.addEventListener(event, callback);
	};

	global.Car.prototype._updateDirections = function() {
		var n = this._currentTile.roadFromNorth(),
			s = this._currentTile.roadFromSouth(),
			e = this._currentTile.roadFromEast(),
			w = this._currentTile.roadFromWest(),
			maxX = this._board.getWidth() - 1,
			maxY = this._board.getHeight() - 1;

		if ( this._prevTile === this._currentTile ) { //first tile
			if (this._currentTile.getX() === 0) { // start from left side

				if (this._currentTile.getY() === 0 && !w) {
					this._initialDirection = 'n';
					this._endDirection = n;

				} else if (this._currentTile.getY() === maxY && !w) {
					this._initialDirection = 's';
					this._endDirection = s;
				} else {
					this._initialDirection = 'w';
					this._endDirection = w;
				}

			} else if (this._currentTile.getX() === maxX) {
				
				if (this._currentTile.getY() === 0 && !e) {
					this._initialDirection = 'n';
					this._endDirection = n;

				} else if (this._currentTile.getY() === maxY && !e) {
					this._initialDirection = 's';
					this._endDirection = s;

				} else {
					this._initialDirection = 'e';
					this._endDirection = e;
				}

			} else if (this._currentTile.getY() === 0) {
				this._initialDirection = 'n';
				this._endDirection = n;

			} else if (this._currentTile.getY() === maxY) {
				this._initialDirection = 's';
				this._endDirection = s;

			} else {
				if (n) {
					this._initialDirection = 'n';
					this._endDirection  = n;	
				} else if (s) {
					this._initialDirection = 's';
					this._endDirection = s;
				} else if (w) {
					this._initialDirection = 'w';
					this._endDirection = w;
				} else {
					this._initialDirection = 'e';
					this._endDirection = e;
				}

				this._initialDirection = 's';
				this._endDirection = n || s || w || e;

			}
		} else {
			switch (this._endDirection) {
				case 'n':
					this._initialDirection = 's';
					this._endDirection = s;
					break;
				case 's':
					this._initialDirection = 'n';
					this._endDirection = n;
					break;
				case 'e':
					this._initialDirection = 'w';
					this._endDirection = w;
					break;
				case 'w':
					this._initialDirection = 'e';
					this._endDirection = e;
					break;
			}
		}
	};

	global.Car.prototype._updateRoadPoints = function(tileSize) {
		var offsetX = this._currentTile.getX() * tileSize,
			offsetY = this._currentTile.getY() * tileSize,
			offsetStart = 0,
			offsetEnd = 0;

		if(this._currentTile.isStart() && this._currentTile === this._prevTile) {
			offsetStart = this.width;
		}

		if(this._currentTile.isEnd()) {
			offsetEnd = this.width;
		}

		switch (this._initialDirection) {
				case 'n':
					if( this._endDirection === 's') {
						this._p0.x = this._p1.x = this._p2.x  = offsetX + tileSize/2;
						this._p0.y = offsetY - offsetStart;
						this._p1.y = offsetY + tileSize / 4;
						this._p2.y = offsetY + tileSize / 4 * 3; 
						this._p3.y = offsetY + tileSize - 1;
						this._p3.x = offsetX + tileSize/2 + offsetEnd;

					} else if ( this._endDirection === 'w') {
						this._p0.x = this._p1.x = offsetX + tileSize / 2;
						this._p2.y = this._p3.y = offsetY + tileSize / 2;
						this._p0.y = offsetY - offsetStart;
						this._p1.y = offsetY + tileSize / 2;
						this._p2.x = offsetX + tileSize / 2;
						this._p3.x = offsetX + offsetEnd;

					} else if ( this._endDirection === 'e') {
						this._p0.x = this._p1.x = offsetX + tileSize / 2;
						this._p2.y = this._p3.y = offsetY + tileSize / 2;
						this._p0.y = offsetY - offsetStart;
						this._p1.y = offsetY + tileSize / 2;
						this._p2.x = offsetX + tileSize / 2;
						this._p3.x = offsetX + tileSize - 1 - offsetEnd;
					}
					break;

				case 's':
					if( this._endDirection === 'n') {
						this._p0.x = this._p1.x = this._p2.x = this._p3.x = offsetX + tileSize/2;
						this._p0.y = offsetY + tileSize - 1 + offsetStart;
						this._p1.y = offsetY + tileSize / 4 * 3;
						this._p2.y = offsetY + tileSize / 4;
						this._p3.y = offsetY - offsetEnd;

					} else if ( this._endDirection === 'w') {
						this._p0.x = this._p1.x = offsetX + tileSize / 2;
						this._p2.y = this._p3.y = offsetY + tileSize / 2;
						this._p0.y = offsetY + tileSize - 1 + offsetStart;
						this._p1.y = offsetY + tileSize / 2;
						this._p2.x = offsetX + tileSize / 2;
						this._p3.x = offsetX + offsetEnd;

					} else if ( this._endDirection === 'e') {
						this._p0.x = this._p1.x = offsetX + tileSize / 2;
						this._p2.y = this._p3.y = offsetY + tileSize / 2;
						this._p0.y = offsetY + tileSize - 1 + offsetStart;
						this._p1.y = offsetY + tileSize / 2;
						this._p2.x = offsetX + tileSize / 2;
						this._p3.x = offsetX + tileSize - 1 - offsetEnd;

					}
					break;

				case 'e':
					if( this._endDirection === 'w') {
						this._p0.y = this._p1.y = this._p2.y = this._p3.y = offsetY + tileSize/2;
						this._p0.x = offsetX + tileSize - 1 + offsetStart;
						this._p1.x = offsetX + tileSize / 4 * 3; 
						this._p2.x = offsetX + tileSize / 4;
						this._p3.x = offsetX - offsetEnd;

					} else if ( this._endDirection === 'n') {
						this._p0.y = this._p1.y = offsetY + tileSize / 2;
						this._p2.x = this._p3.x = offsetX + tileSize / 2;
						this._p0.x = offsetX + tileSize - 1 +  offsetStart;
						this._p1.x = offsetX + tileSize / 2;
						this._p2.y = offsetY + tileSize / 2;
						this._p3.y = offsetY -  offsetEnd;

					} else if ( this._endDirection === 's') {
						this._p0.y = this._p1.y = offsetY + tileSize / 2;
						this._p2.x = this._p3.x = offsetX + tileSize / 2;
						this._p0.x = offsetX + tileSize - 1 + offsetStart;
						this._p1.x = offsetX + tileSize / 2;
						this._p2.y = offsetY + tileSize / 2;
						this._p3.y = offsetY + tileSize - 1  + offsetEnd;

					}
					break;

				case 'w':
					if( this._endDirection === 'e') {
						this._p0.y = this._p1.y = this._p2.y = offsetY + tileSize/2;
						this._p0.x = offsetX - offsetStart;
						this._p1.x = offsetX + tileSize / 4;
						this._p2.x = offsetX + tileSize / 4 * 3; 
						this._p3.x = offsetX + tileSize - 1 + offsetEnd;
						this._p3.y = offsetY + tileSize/2;
					} else if ( this._endDirection === 'n') {
						this._p0.y = this._p1.y = offsetY + tileSize / 2;
						this._p2.x = this._p3.x = offsetX + tileSize / 2;
						this._p0.x = offsetX - offsetStart;
						this._p1.x = offsetX + tileSize / 2;
						this._p2.y = offsetY + tileSize / 2;
						this._p3.y = offsetY - offsetEnd;

					} else if ( this._endDirection === 's') {
						this._p0.y = this._p1.y = offsetY + tileSize / 2;
						this._p2.x = this._p3.x = offsetX + tileSize / 2;
						this._p0.x = offsetX - offsetStart;
						this._p1.x = offsetX + tileSize / 2;
						this._p2.y = offsetY + tileSize / 2;
						this._p3.y = offsetY + tileSize - 1 + offsetEnd;
					}
					break;
			}
	};

	global.Car.prototype._updateBezierValues = function() {
		this._cx = 3 * (this._p1.x - this._p0.x);
		this._bx = 3 * (this._p2.x - this._p1.x) - this._cx;
		this._ax = this._p3.x - this._p0.x - this._cx - this._bx;

		this._cy = 3 * (this._p1.y - this._p0.y);
		this._by = 3 * (this._p2.y - this._p1.y) - this._cy;
		this._ay = this._p3.y - this._p0.y - this._cy - this._by;
	};

	global.Car.prototype._updateRotation = function() {

		var nextT = this._t + 0.2,
			nextX = this._getX(nextT),
			nextY = this._getY(nextT),
			deltaY = nextY - this.y,
			deltaX = nextX - this.x;
			
			if(nextT <= 1) {
				this.rotate = ~~((Math.atan2(deltaY,deltaX) * 180 / Math.PI) + 0.5);
			}
	};

	global.Car.prototype._getX = function(t) {
		return ~~((this._ax * (t * t * t) + this._bx * (t * t) + this._cx * (t) + this._p0.x) + 0.5);
	};

	global.Car.prototype._getY = function(t) {
		return ~~((this._ay * (t * t * t) + this._by * (t * t) + this._cy * (t) + this._p0.y) + 0.5);
	};

	global.Car.prototype.collision = function (collisionObject) {
		this.alive = false;
		this._listenersMgr.trigger('crash', this);
		if (!this._prevTile.isStart() && !this._prevTile.isEnd()) {
			this._prevTile.unlock();
		}

		if (collisionObject && !this._prevTile.isStart() && !this._prevTile.isEnd()) {
			this._currentTile.unlock();
		}
	};

	global.Car.prototype.drive = function(tileSize) {
		var nextX, 
			nextY;

		if(this._currentTile.isStart() && this._t === 0) {
			this._updateDirections();
			this._updateRoadPoints(tileSize);
			this._updateBezierValues();
		}	

		if(this._t > 1) {
			this._t = 0.0;

			if(this._currentTile.getX() === this._endTileX && this._currentTile.getY() === this._endTileY) { 
				this._listenersMgr.trigger('trip-end', this);
				return;
			}

			this._prevTile = this._currentTile;

			switch(this._endDirection) { //get new Tile and check colision
				case 'w':
					nextX = this._currentTile.getX() - 1;
					nextY = this._currentTile.getY();

					if(nextX >= this._board.getWidth() || nextX < 0 || nextY >= this._board.getHeight() || nextY < 0) {
						this.collision();
						return
					}

					this._currentTile = this._board.getTile(nextX, nextY);
					if(!this._currentTile.roadFromEast()) {
						this.collision();
						return;
					}
					break;
				case 'n':
					nextX = this._currentTile.getX();
					nextY = this._currentTile.getY() - 1;

					if(nextX >= this._board.getWidth() || nextX < 0 || nextY >= this._board.getHeight() || nextY < 0) {
						this.collision();
						return
					}

					this._currentTile = this._board.getTile(nextX, nextY);
					if(!this._currentTile.roadFromSouth()) {
						this.collision();
						return;
					}
					break;
				case 'e':
					nextX = this._currentTile.getX() + 1;
					nextY = this._currentTile.getY();

					if(nextX >= this._board.getWidth() || nextX < 0 || nextY >= this._board.getHeight() || nextY < 0) {
						this.collision();
						return
					}
					this._currentTile = this._board.getTile(nextX, nextY);
					if(!this._currentTile.roadFromWest()) {
						this.collision();
						return;
					}
					break;
				case 's':
					nextX = this._currentTile.getX();
					nextY = this._currentTile.getY() + 1;

					if(nextX >= this._board.getWidth() || nextX < 0 || nextY >= this._board.getHeight() || nextY < 0) {
						this.collision();
						return
					}
					this._currentTile = this._board.getTile(nextX, nextY);
					if(!this._currentTile.roadFromNorth()) {
						this.collision();
						return;
					}
					break;
			}
			
			if(!this._prevTile.isStart()) {
				this._prevTile.unlock();
			}

			if(!this._currentTile.isEnd()) {
				this._currentTile.lock();
			}

			this._updateDirections();
			this._updateRoadPoints(tileSize); 
			this._updateBezierValues();
		}


		this.x = this._getX(this._t);
		this.y = this._getY(this._t);
		this._updateRotation();

		this._t += this._velocity;
	};
})(window);