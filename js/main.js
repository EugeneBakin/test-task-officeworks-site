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
	State: function State ( view, runFunc, shutDownFunc ) {
		var pubsub = $({});
		var publish = function publish (topic, data) {
			pubsub.trigger(topic, data);
		}; 
		var subscribe = function subscribe (topic, cb) {
			pubsub.on(topic, cb);
		};

		runFunc = runFunc || function (g,v) { v.render(g); };
		shutDownFunc = shutDownFunc || function (g,v) { v.destroy(g); };

		var run = function run () {
				runFunc( globals, view, publish, shutdown );
		};

		var shutdown = function shutdown () {
				shutDownFunc( globals, view, publish, run ); 
		}

		var globals = null;
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
			if (currentState) {
				currentState.shutDown();
			};
			currentState = states[stateName];
			currentState.run();
			currentStateName = stateName;
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
	}
};
