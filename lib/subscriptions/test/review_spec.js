const assert = require('assert');
const ReviewProcess = require('../processes/review');
const MembershipApplication = require('../models/membership_application');
const sinon = require('sinon');

describe('The review process', function () {

	describe('Receiving a valid application', function() {
		var decision;
		var validApp = new MembershipApplication({
			first: 'Test',
			last: 'User',
			email: 'test@user.com',
			age: 30,
			height: 66,
			weight: 180
		});
		var review = new ReviewProcess({
			application: validApp
		});

		sinon.spy(review, 'ensureAppValid');
		sinon.spy(review, 'findNextMission');
		sinon.spy(review, 'roleIsAvailable');
		sinon.spy(review, 'ensureRoleCompatible');
		
		before(function(done) {

			review.processApplication(function(err, result) {
				decision = result;
				done();
			});
		});

		it('returns success', function() {
			assert(decision.success, decision.message);
		});

		it('ensure the application is valid', function() {
			assert(review.ensureAppValid.called)
		});

		it('selects a mission', function() {
			assert(review.findNextMission.called)
		});

		it('ensure a role exists', function() {
			assert(review.roleIsAvailable.called)
		});

		it('ensure role compatibility', function() {
			assert(review.ensureRoleCompatible.called)
		});
	});
});