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
		var review = new ReviewProcess();
		var validationSpy = sinon.spy();
		var missionSpy = sinon.spy();
		var roleAvailableSpy = sinon.spy();
		var roleCompatibleSpy = sinon.spy();
		
		before(function(done) {
			review.on('validated', validationSpy);
			review.on('mission-selected', missionSpy);
			review.on('role-available', roleAvailableSpy);
			review.on('role-compatible', roleCompatibleSpy);

			review.processApplication(validApp, function(err, result) {
				decision = result;
				done();
			});
		});

		it('returns success', function() {
			assert(decision.success, decision.message);
		});

		it('ensure the application is valid', function() {
			assert(validationSpy.called)
		});

		it('selects a mission', function() {
			assert(missionSpy.called)
		});

		it('ensure a role exists', function() {
			assert(roleAvailableSpy.called)
		});

		it('ensure role compatibility', function() {
			assert(roleCompatibleSpy.called)
		});
	});
});