(function() {
	"use strict";

	window.EventListenersManager = function(events) {
		var listeners = {};

		function init() {
			var i, event;

			for(i in events) {
				if (!events.hasOwnProperty(i)) {
					continue;
				}
				event = events[i];

				listeners[event] = [];
			}
		}
		init();

		this.trigger = function(event, data) {
			if (listeners[event] === undefined) {
				throw 'Event invalid.';
			}

			for (var i = 0, l = listeners[event].length; i < l; i++) {
				listeners[event][i](data);
			}
		};

		this.addEventListener = function(event, callback) {
			if (listeners[event] === undefined) {
				throw 'Event invalid.';
			}

			if (typeof callback !== "function") {
				throw 'Event invalid.';
			}

			listeners[event].push(callback);
		};

		this.removeEventListener = function(event, callback) {
			if (event && listeners[event] === undefined) {
				throw 'Event invalid.';
			} else if(!event) {
				listeners = [];
				return;
			}

			if(!callback) {
				listeners[event] = [];
			} else {
				for(var i in listeners[event]) {
					if (!listeners[event].hasOwnProperty(i)) {
						continue;
					}

					if(listeners[event][i] === callback) {
						listeners[event].splice(i, 1);
						break;
					}
				}
			}
		};
	}
})();