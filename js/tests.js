var tests = {
	'Router' : {
		'before': function () {
			this.fakeLocation = {
				'hash': 'fake'
			};
			this.fakeWindow = {'location': this.fakeLocation};
		},
		'tests':{
			'checkIfLocationIsSetToStartStateOnInit': function (assert) {
				var router = Main.HashRouter( 'changed', this.fakeLocation, this.fakeWindow );
				assert.strictEqual('#changed', this.fakeLocation.hash, 'hash changed to "#changed"' );
			},
			'checkIfLocationIsChangedOnEvent': function (assert) {
				var done = assert.async();
				var router = Main.HashRouter( 'state', this.fakeLocation, this.fakeWindow );
				var $window = $(this.fakeWindow);
				assert.strictEqual('#state', this.fakeLocation.hash, 'hash was equal to "#state" at start');
				router.subscribe('state/changed', function (event, state) { 
					assert.strictEqual(state, 'changedState', 'router triggered event "state/changed" with "changedState" argument');
					done();
				});
				this.fakeLocation.hash = '#changedState';
				$window.trigger('hashchange');
			}
		}
	},
	'State' : {
		'before': function () {
			this.fakeView = {
				'rendered': 0,
				'destroyed': 0,
				'render': function() {
					this.rendered++;
				},
				'destroy': function() {
					this.destroyed++;
				}
			};		
		},
		'tests': {
			'checkIfRenderMethodIsCalledOnRun': function ( assert ) {
				var state = Main.State( this.fakeView, function(g,v) { v.render(); } );
				state.run();
				assert.strictEqual(1, this.fakeView.rendered, 'fakeView was rendered on run');
			},
			'checkIfDestroyMethodIsCalledOnShutDown': function ( assert ) {
				var state = Main.State( this.fakeView, null, function(g,v) { v.destroy(); } );
				state.shutDown();
				assert.strictEqual(1, this.fakeView.destroyed, 'fakeView was destroyed on shutDown');
			},
			'checkIfRenderMethodAndDestroyMethodIsCalledOnRunAndShutDownInSimpleCase': function ( assert ) {
				var state = Main.State( this.fakeView);
				state.run();
				assert.strictEqual(1, this.fakeView.rendered, 'fakeView was rendered once, when no behaviour specified');
				state.shutDown();
				assert.strictEqual(1, this.fakeView.destroyed, 'fakeView was destroyed once, when no behaviour specified');
			},
			'checkIfSubscribeMethodWorks': function ( assert ) {
				var done = assert.async();
				var state = Main.State( this.fakeView, function(g,v,publish) {publish('event', 'data');})
				state.subscribe('event', function(event, data) {
					assert.strictEqual('data', data, 'data in subscribed event is equal to "data"');
					done();
				});
				state.run();
			}
		}
	},
	'Application': {
		'before': function () {
			this.emptyView = {
				render: function(){},
				destroy: function(){}
			};

			this.fakeLocation = {'hash': ''};
			this.fakeWindow = {'location': this.fakeLocation};
			this.fakeRouter =  Main.HashRouter( '', this.fakeLocation, this.fakeWindow );
		},
		'tests': {
			'checkIfApplicationInitializedDefaultStateAndRendered': function( assert ) {
				var done = assert.async();
				var states = {
					'state1' : Main.State( { render: function() { assert.ok( true, 'state1 ran' ); done(); }, destroy: function() {}} ),
					'state2' : Main.State( this.emptyView )
				};
				Main.Application( 'state1', {}, states, this.fakeRouter );
			},
			'checkIfApplicationRespondsToRouterEventsAndChangedStates': function( assert ) {
				var done = assert.async();
				var $window = $(this.fakeWindow);
				var states = {
					'state1' : Main.State( { render: function() { }, destroy: function() { assert.ok( true, 'state1 destroyed '); }} ),
					'state2' : Main.State( { render: function() { assert.ok(true, 'state2 ran'); done(); }, destroy: function() {}} )
				};
				Main.Application( 'state1', {}, states, this.fakeRouter );
				this.fakeLocation.hash = '#state2';
				$window.trigger('hashchange');
			}
		}
	},
	'empty module' : {}
};

var testJS = function () {
	$('#qunit').show();
	for ( moduleName in tests ) {
		QUnit.module( moduleName, {
			beforeEach: tests[moduleName]['before'] || $.noop,
			afterEach: tests[moduleName]['after'] || $.noop
		});
		for( testName in tests[moduleName]['tests'] ) {
			QUnit.test( testName, tests[moduleName]['tests'][testName] );
		}
	}
}
