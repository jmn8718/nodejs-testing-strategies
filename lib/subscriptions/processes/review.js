const async = require('async');
const assert = require('assert');
const MissionControl = require('../models/mission_control');
const Assignment = require("../models/assignment");
const Billing = require("./billing");

const ReviewProcess = function(args = {}) {
	assert(args.application, 'Need an application to review');
	assert(args.db, 'Need a database instance');
  assert(args.billing, "Need a subscription processor");

	let assignment, mission;
	let application = args.application;
	let db = args.db;
  let billing = args.billing;
	let missionControl = new MissionControl({ db });

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
		//grab the current mission from mission control
    missionControl.currentMission(function(err, res){
      if(err) {
        next(err,null);
      }else {
        mission = res;
        next(null, res);
      }
    });
	}
	// make sure role selected is available
	this.roleIsAvailable = function(next) {
		missionControl.hasSpaceForRole(application.role, next);
	}
	// make sure height/weight/age is right for the role
	this.ensureRoleCompatible = function(next) {
		assignment = new Assignment({
      passenger: application, 
      role: application.role,
      mission
    });
    //TODO: find out about roles and height/weight etc
    next(null, assignment.passengerIsCompatible);
	}

	this.approveApplication = function(next) {
		//send the assignment to disk
    db.saveAssignment({ assignment }, next);
	}

	this.startSubscription = function(next) {
    billing.createSubscription({
      name : `${application.first} ${application.last}`,
      email : application.email,
      plan : application.role,
      card : application.card
    }, next);
	}

	this.processApplication = function(next) {
		async.series({
			validated: this.ensureAppValid,
			mission: this.findNextMission,
			roleAvailable: this.roleIsAvailable,
			roleCompatible: this.ensureRoleCompatible,
			subscription: this.startSubscription,
			assignment: this.approveApplication
		}, function (err, result) {
			if (err) {
				next(null, {
					success: false,
					message: err
				});
			} else {
        result.success = true;
				result.message = 'Welcome to Mars';
				next(null, result);
			}
		});
	}
}

module.exports = ReviewProcess;