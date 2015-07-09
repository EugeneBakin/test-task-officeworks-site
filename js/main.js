var Main = {
	HashRouter: function HashRouter ( startState, location, window ) {

		var pubsub = $({});
		var currentState = '';
		var publish = function publish (topic, data) {
			pubsub.trigger(topic, data);
		}; 
		var subscribe = function subscribe (topic, cb) {
			pubsub.on(topic, cb);
		};
		var setState = function setState (state) {
			if (currentState !== state) {
				currentState = state;
				location.hash = '#' + state;
				publish('state/changed', state);
			}
		};

		setState(startState);

		$(window).on('hashchange', function() {
			setState(location.hash.slice(1));
		});

		return {
			subscribe: subscribe,
			setState: setState
		};
	}
};
