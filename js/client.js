var screen1;
var screen2;
var screen3;
var screen4;

$(function () {
	var view1 = {
		render: function () {
			$('#choose-type').show();
		},
		destroy: function () {
			$('#choose-type').hide();
		}
	};

	screen1 = Main.State({},view1);

	var view2 = {
		render: function() {
			$('#pass-form').show();
		},
		destroy: function() {
			$('#pass-form').hide()
		}
	};

	screen2 = Main.State({},view2);

	var view3 = {
		render: function() {
			$('#pass-confirm').show();
		},
		destroy: function() {
			$('#pass-confirm').hide()
		}
	};

	screen3 = Main.State({},view3);

	var view4 = {
		render: function() {
			$('#pass-success').show();
		},
		destroy: function() {
			$('#pass-success').hide()
		}
	};

	screen4 = Main.State({},view4);

})
