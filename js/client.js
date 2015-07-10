var screen1;

$(function () {
	var firstScreenView = {
		render: function () {
			$('#choose-type').show();
		},
		destroy: function () {
			$('#choose-type').hide();
		}
	};

	screen1 = Main.State({},firstScreenView);
})
