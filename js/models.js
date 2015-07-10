var Models = {
	Pass: function Pass ( visitors, startDate, endDate, singleDate ) {
		startDate = startDate || new Date();

		if (!endDate) {
			endDate = new Date();
			endDate.setTime(startDate.getTime() + 60 * 60 * 24 * 1000 );
		}

		return {
			visitors: visitors || [],
			startDate: startDate,
			endDate: endDate,
			singleDate: singleDate || true
		};
	},
	Visitor: function Visitor ( name, phone, email, company ) {
	
		return {
			name: name || '',
			phone: phone || '',
			email: email || '',
			company: company || ''
		}
	} 
}
