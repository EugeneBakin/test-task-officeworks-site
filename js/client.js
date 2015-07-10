$(function () {
	var screen1 = Main.State({
		render: function () {
			$('#choose-type').show();
		},
		destroy: function () {
			$('#choose-type').hide();
		}
	});

	var screen2 = Main.State({
		render: function() {
			$('#pass-form').show();
		},
		destroy: function() {
			$('#pass-form').hide()
		}
	});

	var screen3 = Main.State({
		render: function() {
			$('#pass-confirm').show();
		},
		destroy: function() {
			$('#pass-confirm').hide()
		}
	});

	var screen4 = Main.State({
		render: function() {
			$('#pass-success').show();
		},
		destroy: function() {
			$('#pass-success').hide()
		}
	});

	var states = {
		'choose-type': screen1,
		'pass-form': screen2,
		'pass-confirm': screen3,
		'pass-success': screen4
	};

	var router = Main.HashRouter('', location, window);

	var application = Main.Application( 'choose-type', {}, states, router );

})
