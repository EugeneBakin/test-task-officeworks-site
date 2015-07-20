var Models = {
	Pass: function Pass ( visitors, startDate, endDate, singleDate ) {
		startDate = startDate || new Date();

		if (!endDate) {
			endDate = new Date();
			endDate.setTime(startDate.getTime() + 60 * 60 * 24 * 1000 );
		}

		visitors = visitors || [];

		var pass = {
			errors: [],
			visitors: visitors,
			startDate: startDate,
			endDate: endDate,
			singleDate: singleDate || true,
			checkErrors: checkErrors,
			getNotEmptyVisitors: getNotEmptyVisitors
		};

		return pass;

		function checkErrors() {
			var hasErrors = false;
			var notEmptyVisitors = getNotEmptyVisitors();
			if (!notEmptyVisitors.length) {
				visitors[0].errors = {
					name: true,
					company: true,
					phone: true,
					email: true
				}
				hasErrors = true;
			}

			if (pass.startDate > pass.endDate) {
				pass.errors.startDate = true;
				pass.errors.endDate = true;
				hasErrors = true;
			} else {
				pass.errors.startDate = false;
				pass.errors.endDate = false;
			}

			return notEmptyVisitors.reduce(function(hasErrors, visitor) { return visitor.checkErrors() || hasErrors; }, false) || hasErrors;
		}

		function getNotEmptyVisitors() {
			return visitors.filter(function (visitor) {
				return !visitor.isEmpty();
			});
		}
	},
	Visitor: function Visitor ( name, phone, email, company ) {

		var errors = {};

		var visitor = {
			name: name || '',
			phone: phone || '',
			email: email || '',
			company: company || '',
			setName: function (newName) {
				visitor.name = newName;
				visitor.errors.name = false;
			},
			setPhone: function (newPhone) {
				visitor.phone = newPhone;
				visitor.errors.phone = false;
			},
			setEmail: function (newEmail) {
				visitor.email = newEmail;
				visitor.errors.email = false;
			},
			setCompany: function (newCompany) {
				visitor.company = newCompany;
				visitor.errors.company = false;
			},
			isEmpty: isEmpty,
			checkErrors: checkErrors,
			errors: errors
		};

		return visitor;

		function isEmpty () {
			return !visitor.name && !visitor.phone && !visitor.email && !visitor.company;
		}

		function checkErrors () {
			if (!visitor.name) {
				errors.name = 'Empty name';
			}

			if (!visitor.company) {
				errors.company = 'Empty company';
			}

			if (!visitor.phone && !visitor.email) {
				errors.phone = errors.email = 'Both phone and email are empty';
			} else {
				errors.phone = errors.email = false;
			}

			return errors.name || errors.company || errors.phone || errors.email;
		}
	} 
}
