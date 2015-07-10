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
	},
	State: function State ( view, actions ) {
		var pubsub = $({});
		var publish = function publish (topic, data) {
			pubsub.trigger(topic, data);
		}; 
		var subscribe = function subscribe (topic, cb) {
			pubsub.on(topic, cb);
		};
		var action = function action (type) {
			if (actions[type]) {
				actions[type](globals);
			}
		}

		var runFunc = function (g,v,a) { v.render(g,a); };
		var shutDownFunc = function (g,v,a) { v.destroy(g,a); };

		var run = function run () {
				runFunc( globals, view, action );
		};

		var shutdown = function shutdown () {
				shutDownFunc( globals, view, action ); 
		}

		var globals = null;

		view.onChange = function onChange () {
			view.render(globals, action);
		}

		function setGlobals(newGlobals) {
			globals = newGlobals;
		}

		return {
			subscribe: subscribe,
			run: run,
			shutDown: shutdown,
			setGlobals: setGlobals
		};
	},
	Application: function Application ( initialState, globals, states, router ) {
		router.setState( initialState );
		router.subscribe( 'state/changed', function(event, stateName) {
			setState(stateName);
		} );

		var currentState;
		var currentStateName = initialState;

		for ( stateName in states ) {
			states[stateName].setGlobals(globals);
			if (stateName === initialState ) {
				currentStateName = stateName;
				currentState = states[stateName];
			}
		}

		currentState.run();

		function setState(stateName) {
			if (currentState) {
				currentState.shutDown();
			};
			currentState = states[stateName];
			currentState.run();
			currentStateName = stateName;
		}

		return {
			setState: setState
		};
	}
};
