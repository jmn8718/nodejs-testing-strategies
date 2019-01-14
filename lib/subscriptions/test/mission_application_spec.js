const assert = require('assert');
const Helpers = require('./helpers');
const MembershipApplication = require('../models/membership_application');

describe('Membership application requirements', function () {
	var validApp;

	before(function() {
		validApp = Helpers.validApplication;
	});

	describe('Applications valid if', function () {
		it('all validators successfull', function () {
			assert(validApp.isValid(), 'Not valid application');
		});
		it('email is 4 or more chars and contains @', function () {
			assert(validApp.emailIsValid());
		});
		it('height is between 60 and 75 inches', function () {
			assert(validApp.heightIsValid());
		});
		it('age is between 15 and 100', function () {
			assert(validApp.ageIsValid());
		});
		it('weight is between 100 and 300', function () {
			assert(validApp.weightIsValid());
		});
		it('first and last name are provided', function () {
			assert(validApp.nameIsValid());
		});
	});

	describe('Application invalid if', function() {
		it('email is 4 chars or less', function () {
			const application = new MembershipApplication({
				email: 'd@d'
			});
			assert(!application.emailIsValid());
		});
		it('email does not contain @', function () {
			const application = new MembershipApplication({
				email: 'test_user.com'
			});
			assert(!application.emailIsValid());
		});
		it('email is ommited', function () {
			const application = new MembershipApplication();
			assert(!application.emailIsValid());
		});

		it('height is less than 60 inches', function () {
			const application = new MembershipApplication({
				height: 59
			});
			assert(!application.heightIsValid());
		});
		it('height is more than 75 inches', function () {
			const application = new MembershipApplication({
				height: 76
			});
			assert(!application.heightIsValid());
		});
		it('height is ommited', function () {
			const application = new MembershipApplication();
			assert(!application.heightIsValid());
		});

		it('age is less than 15', function () {
			const application = new MembershipApplication({
				age: 14
			});
			assert(!application.ageIsValid());
		});
		it('age is more than 100', function () {
			const application = new MembershipApplication({
				age: 101
			});
			assert(!application.ageIsValid());
		});
		it('age is ommited', function () {
			const application = new MembershipApplication();
			assert(!application.ageIsValid());
		});

		it('weight is less than 100', function () {
			const application = new MembershipApplication({
				weight: 59
			});
			assert(!application.weightIsValid());
		});
		it('weight is more than 300', function () {
			const application = new MembershipApplication({
				weight: 76
			});
			assert(!application.weightIsValid());
		});
		it('weight is ommited', function () {
			const application = new MembershipApplication();
			assert(!application.weightIsValid());
		});

		it('first is ommited', function () {
			const application = new MembershipApplication({
				last: 'user'
			});
			assert(!application.nameIsValid());
		});
		it('last is ommited', function () {
			const application = new MembershipApplication();
			assert(!application.nameIsValid());
		});

		it('is past validUntil date', function () {
			const application = new MembershipApplication({
				validUntil: '20100101' //YYYYMMDD
			});
			assert(application.expired());
		});

	});

});