(function(global, undefined) {
	
	global.Resource = function(options) {
		var images = [],
			elements = {},
			loaded = 0,
			listenersMgr = new EventListenersManager(['load']);

		function onLoad(e) {
			loaded++;
			listenersMgr.trigger('load');
		}

		/**
		 * Allows listening to predefined events (load)
		 * @param {string} event
		 * @param {function} callback
		 */
		this.on = function(event, callback) {
			listenersMgr.addEventListener(event, callback);
		}

		this.add = function(files) {
			var i;

			if(files instanceof Array) {
				i = files.length;
				while(i--) {
					images.push(files[i]);
				}
			}		
		}

		this.load = function() {
			var element,
				i = images.length;

			while(i--) {
				element = document.createElement('img');
				element.onload = onLoad;
				element.src = 'gfx/' + images[i] + '.png';
				elements[images[i]] = element; 
			};		
		}

		this.get = function(name) {
			if(!elements[name]) {
				throw 'No "' + name + '" resource in collection';
			}
			return elements[name]; 
		}

		this.getPercentage = function() {
			return ~~((loaded / images.length) * 100 + 0.5); 
		}
	}
})(window)