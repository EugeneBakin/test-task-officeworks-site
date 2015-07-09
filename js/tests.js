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
