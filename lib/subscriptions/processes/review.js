const async = require('async');
const assert = require('assert');

const ReviewProcess = function(args = {}) {
	assert(args.application, 'Need an application to review');
	let application = args.application;
	


	// make sure the application is valid
	this.ensureAppValid = function(next) {
		if (application.isValid()) {
			next(null, true);
		} else {
			next(app.validationMessage, null);
		}
	};

	// find next mission
	this.findNextMission = function(next) {
		next(null, {
			commander: null,
			pilot: null,
			MAVPilot: null,
			passengers: []
		});
	}
	// make sure role selected is available
	this.roleIsAvailable = function(next) {
		next(null, true);
	}
	// make sure height/weight/age is right for the role
	this.ensureRoleCompatible = function(next) {
		next(null, true);
	}

	this.approveApplication = function(next) {
		next(null, true);
	}

	this.processApplication = function(next) {
		async.series({
			validated: this.ensureAppValid,
			mission: this.findNextMission,
			roleAvailable: this.roleIsAvailable,
			roleCompatible: this.ensureRoleCompatible,
			success: this.approveApplication
		}, function (err, result) {
			if (err) {
				next(null, {
					success: false,
					message: err
				});
			} else {
				result.message = 'Welcome to Mars';
				next(null, result);
			}
		});
	}
}

module.exports = ReviewProcess;