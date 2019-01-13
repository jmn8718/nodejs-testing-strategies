const Emitter = require('events').EventEmitter;
const util = require('util');

const ReviewProcess = function(args = {}) {
	let callback;

	// make sure the application is valid
	this.ensureAppValid = function(application) {
		if (application.isValid()) {
			this.emit('validated', application);
		} else {
			this.emit('invalid', app.validationMessage);
		}
	};

	// find next mission
	this.findNextMission = function(application) {
		application.mission = {
			commander: null,
			pilot: null,
			MAVPilot: null,
			passengers: []
		}
		this.emit('mission-selected', application);
	}
	// make sure role selected is available
	this.roleIsAvailable = function(application) {
		this.emit('role-available', application);
	}
	// make sure height/weight/age is right for the role
	this.ensureRoleCompatible = function(application) {
		this.emit('role-compatible', application);
	}
	// accept the application with a message
	this.acceptApplication = function() {
		callback(null, {
			success: true,
			message: 'Welcome to the Mars Program!'
		});
	}
	// deny the application with a message
	this.denyApplication = function(message) {
		callback(null, {
			success: false,
			message
		});
	}

	this.processApplication = function(application, next) {
		callback = next;
		this.emit('application-received', application);
	}

	// event path
	this.on('application-received', this.ensureAppValid);
	this.on('validated', this.findNextMission);
	this.on('mission-selected', this.roleIsAvailable);
	this.on('role-available', this.ensureRoleCompatible);
	this.on('role-compatible', this.acceptApplication);

	// sad path
	this.on('invalid', this.denyApplication);
}

util.inherits(ReviewProcess, Emitter);
module.exports = ReviewProcess;