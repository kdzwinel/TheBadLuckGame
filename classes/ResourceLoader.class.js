(function(global, undefined) {
	"use strict";
	
	global.ResourceLoader = function() {
		var images = [],
			elements = {},
			loaded = 0,
			listenersMgr = new EventListenersManager(['load']),
			that = this;

		function onLoad() {
			loaded++;
			listenersMgr.trigger('load', that.getPercentage());
		}

		/**
		 * Allows listening to predefined events (load)
		 * @param {string} event
		 * @param {function} callback
		 */
		this.on = function(event, callback) {
			listenersMgr.addEventListener(event, callback);
		};

		this.add = function(files) {
			var i;

			if(files instanceof Array) {
				i = files.length;
				while(i--) {
					images.push(files[i]);
				}
			}
		};

		this.load = function() {
			var element,
				i = images.length;

			while(i--) {
				var img = images[i];
				element = document.createElement('img');
				element.onload = onLoad;
				element.src = 'gfx/' + img + '.png';
				elements[img] = element;
			}
		};

		this.get = function(name) {
			if(!elements[name]) {
				throw 'Invalid image.';
			}
			return elements[name]; 
		};

		this.getPercentage = function() {
			return ~~((loaded / images.length) * 100 + 0.5); 
		}
	}
})(window);