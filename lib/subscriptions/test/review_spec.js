const assert = require('assert');
const sinon = require('sinon');
const ReviewProcess = require('../processes/review');
const Helpers = require('./helpers');

describe('The review process', function () {
	describe('Receiving a valid application', function() {
		var decision, review;
		var validApp = Helpers.validApplication;

		before(function(done) {
			var db = Helpers.stubDB();
			sinon.stub(db, 'saveAssignment').yields(null, { saved: true });
			review = new ReviewProcess({
				application: validApp,
				db
			});
	
			sinon.spy(review, 'ensureAppValid');
			sinon.spy(review, 'findNextMission');
			sinon.spy(review, 'roleIsAvailable');
			sinon.spy(review, 'ensureRoleCompatible');

			review.processApplication(function(err, result) {
				decision = result;
				done();
			});
		});
 
		it('returns success', function() {
			assert(decision.success, decision.message);
		});
 
		it('returns an assignment', function() {
			assert(decision.assignment);
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