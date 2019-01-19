const assert = require('assert');
const nock = require('nock');
const { clone } = require('underscore')._;
const DB = require('../db');
const ReviewProcess = require('../processes/review');
const Billing = require('../processes/billing');
const Helpers = require('./helpers');

describe('The review process', function () {
	var db = new DB();
	const billing = new Billing({ stripeKey: 'xxx' });
	
	before(function() {
		db.clearStores()
	});

	describe('Receiving a valid application', function() {
		var decision, review;
		var validApp = clone(Helpers.validApplication);

		before(function(done) {
			const goodCall = nock('https://api.stripe.com/v1')
												.post('/customers')
												.reply(200, Helpers.goodStripeResponse);

			review = new ReviewProcess({
				application: validApp,
				db,
				billing
			});

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