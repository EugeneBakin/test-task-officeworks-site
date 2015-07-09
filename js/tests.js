var test = function () {};
var tests = {
	'router' : {
		'check': function (assert) {
			assert.strictEqual(1,1);
		}
	},
	'not router' : {
		'check 2' : function (assert) {
			assert.strictEqual(1,'1');
		} 
	}
};

$(function () {
	test = function () {
		$('#qunit').show();
		for ( moduleName in tests ) {
			console.log(moduleName, tests[moduleName]);
			QUnit.module( moduleName );
			for( testName in tests[moduleName] ) {
				console.log(testName, tests[moduleName][testName]);
				QUnit.test( testName, tests[moduleName][testName] );
			}
		}
	}
});
