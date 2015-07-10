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
		render: function( globals, action ) {

			var that = this;
			if (!this.rendered) {
				this.visitorTemplate = $('[data-template="pass-visitor"]');
				this.visitorTemplatePlaceholder = $('<div></div>').insertAfter(this.visitorTemplate).hide();
				this.visitorTemplate.detach();

				var section = $('#pass-form');
				this.clone = section.clone();
				this.rendered = true;
				section.show();

				this.fields = {
					startDate: section.find('[data-field="datestart"]'),
					endDate: section.find('[data-field="datefinish"]'),
					singleDate: section.find('[name="SingleDate"]'),
					visitors: []
				};

				this.fields.singleDate.on('change', function () {
					globals.pass.singleDate = +that.fields.singleDate.filter(':checked').val();
					that.onChange();
				});

				this.fields.startDate.on('change', function () {
					var date = that.fields.startDate.val().split('.');
					globals.pass.startDate.setDate(date[0] || 1);
					globals.pass.startDate.setMonth((date[1] || 1) - 1);
					globals.pass.startDate.setFullYear(date[2] || 1990);
					that.onChange();
				});

				this.fields.endDate.on('change', function () {
					var date = that.fields.endDate.val().split('.');
					globals.pass.endDate.setDate(date[0] || 1);
					globals.pass.endDate.setMonth((date[1] || 1) - 1);
					globals.pass.endDate.setFullYear(date[2] || 1990);
					that.onChange();
				});

				section.find('[data-action="add-visitor"]').on('click', function () {
					globals.pass.visitors.push( Models.Visitor() );
					that.onChange();
				});

				var dateSelects = section.find('[name="js-date-select"]');

				dateSelects.each(function (index, dateSelect) {
					var date = new Date();
					var time = globals.today.getTime() + ( +dateSelect.value ) * 60 * 60 * 24 * 1000;

					if (+dateSelect.value === 0) {
						dateSelect.checked = true;
					}

					if (+dateSelect.value > 2) {
						date.setTime(time);
						section.find('.js-date-select-label').filter('[data-value=' + (+dateSelect.value) + ']').text(date.getDate() + ' ' + getMonth(date) + ', ' + getDay(date));
					}

					dateSelect.value = time;
				});

				dateSelects.on('change', function () {
					var time = dateSelects.filter(':checked').val();
					globals.pass.startDate.setTime(time);
					globals.pass.endDate.setTime((+time) + 60 * 60 * 24 * 1000);
					that.onChange();
				});

				section.find('[data-type="pass"]').on('submit', function (event) {
					event.preventDefault();
					action('commit');
				});
			}

			globals.pass.visitors.forEach(function (visitor, index) {
				var template = that.fields.visitors[index] || that.visitorTemplate.clone().insertBefore(that.visitorTemplatePlaceholder);

				var name = template.find('[data-field="name"]');
				var email = template.find('[data-field="email"]');
				var company = template.find('[data-field="company"]');
				var phone = template.find('[data-field="phone"]');

				if(!that.fields.visitors[index]) {
					name.on('change', function() {
						globals.pass.visitors[index]['name'] = name.val();
						that.onChange();
					});
					email.on('change', function() {
						globals.pass.visitors[index]['email'] = email.val();
						that.onChange();
					});
					company.on('change', function() {
						globals.pass.visitors[index]['company'] = company.val();
						that.onChange();
					});
					phone.on('change', function() {
						globals.pass.visitors[index]['phone'] = phone.val();
						that.onChange();
					});
				}

				name.val(visitor.name);
				email.val(visitor.email);
				company.val(visitor.company);
				phone.val(visitor.phone);

				that.fields.visitors[index] = template;
			});

			var startDate = globals.pass.startDate;
			var endDate = globals.pass.endDate;

			this.fields.startDate.val( formatDate(startDate) );
			this.fields.endDate.val( formatDate(endDate) );

			if (globals.pass.singleDate) {
				this.fields.endDate.prop('disabled', 'disabled');
			} else {
				this.fields.endDate.prop('disabled', false);
			}

			this.fields.singleDate.filter('[value=' + ( +globals.pass.singleDate ) + ']').prop('checked', 'checked');

			function formatDate(date) {
				return padDate(date.getDate()) + '.' + padDate( date.getMonth() + 1 ) + '.' + date.getFullYear();
			}

			function padDate(string) {
				return ('00' + string).slice(('' + string).length);
			}

			function getDay(date) {
				var days = ['Вс', 'Пн','Вт','Ср','Чт','Пт','Сб'];
				return days[date.getDay()];
			}

			function getMonth(date) {
				var months = [ 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'	];
				return months[date.getMonth()];
			}
		},
		destroy: function() {
			$('#pass-form').replaceWith(this.clone).hide();
			this.rendered = false;
		}
	}, {
		commit: function () {
			application.setState('pass-confirm');
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

	var today = new Date();
	var visitor = Models.Visitor();
	var pass = Models.Pass([visitor]);

	var application = Main.Application( 'choose-type', { pass: pass, today: today }, states, router );

})
