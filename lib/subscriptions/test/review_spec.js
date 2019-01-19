const assert = require('assert');
const nock = require('nock');
const sinon = require('sinon');
const { clone } = require('underscore')._;
const ReviewProcess = require('../processes/review');
const Billing = require('../processes/billing');
const Helpers = require('./helpers');

describe('The review process', function () {
	var db = Helpers.stubDB();
	const billing = new Billing({ stripeKey: 'xxx' });

	describe('Receiving a valid application', function() {
		var decision, review;
		var validApp = clone(Helpers.validApplication);
		sinon.stub(db, 'saveAssignment').yields(null, { id: 1 });

		before(function(done) {
			const goodCall = nock('https://api.stripe.com/v1')
												.post('/customers')
												.reply(200, Helpers.goodStripeResponse);

			review = new ReviewProcess({
				application: validApp,
				db,
				billing
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

		it('returns a subscription', function() {
			assert(decision.subscription)
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

	describe('Valid application, failed billing', function() {
		var decision, review;
		var badBillingApp = clone(Helpers.validApplication);
		badBillingApp.card = 2;
		
		before(function(done) {
			const badCall = nock('https://api.stripe.com/v1')
												.post('/customers')
												.reply(402, Helpers.badStripeResponse);

			review = new ReviewProcess({
				application: badBillingApp,
				db,
				billing
			});
	
			review.processApplication(function(err, result) {
				decision = result;
				done();
			});
		});

		it('returns false for success', function() {
			assert(!decision.success);
		});

	});
});