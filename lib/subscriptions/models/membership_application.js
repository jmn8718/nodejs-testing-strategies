const { _ } = require('underscore');
const moment = require('moment');

const MembershipApplication = function(args = {}) {

	_.extend(this, args);

	this.validUntil = args.validUntil ? moment(args.validUntil) : moment().add(10, 'days');

	this.expired = function() {
		return this.validUntil.isBefore(moment());
	};

	this.emailIsValid = function() {
		return this.email && this.email.length > 3 && this.email.indexOf('@') > -1;
	};

	this.heightIsValid = function() {
		return this.email && this.height > 60 && this.height < 75;
	};

	this.ageIsValid = function() {
		return this.age && this.age < 100 && this.age > 15;
	};

	this.weightIsValid = function() {
		return this.weight && this.weight > 100 && this.weight < 300;
	};

	this.nameIsValid = function() {
		return this.first && this.last;
	};

	this.validationMessage = function() {
		if (this.isValid()) {

		} else if (!this.emailIsValid()) {
			return 'Email is invalid';
		} else if (!this.ageIsValid()) {
			return 'Age is outside of the limits of 15 and 100 years';
		} else if (!this.heightIsValid()) {
			return 'Height is outside of the limits of 60 and 75 inches';
		} else if (!this.weightIsValid()) {
			return 'Weight is outside of the limits of 100 and 300 pounds';
		} else if (!this.nameIsValid()) {
			return 'First and Last name is required';
		} else if (!this.expired()) {
			return 'Application is expired';
		}
	}

	this.isValid = function() {
		return this.emailIsValid()
			&& this.nameIsValid()
			&& this.heightIsValid()
			&& this.ageIsValid()
			&& this.weightIsValid()
			&& !this.expired();
	}
}

module.exports = MembershipApplication;