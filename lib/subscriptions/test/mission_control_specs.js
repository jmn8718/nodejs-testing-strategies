const assert = require('assert');
const MissionControl = require('../models/mission_control');
const DB = require('../db');

describe('Mission Planning', function() {
	var missionControl, db = new DB();
	
	before(function() {
		db.clearStores()
	});

	before(function() {
		missionControl = new MissionControl({ db });
	});

	describe('No current Mission', function() {
		var currentMission;
		before(function(done) {
			missionControl.currentMission(function(err, res) {
				currentMission = res;
				done();
			});
		});

		it('it is created if none exist', function() {
			assert(currentMission);
		});
	});

	describe('Current Mission exists', function() {
		var currentMission;
		before(function(done) {
			missionControl.currentMission(function(err, res) {
				currentMission = res;
				done();
			});
		});

		it('it is created if none exist', function() {
			assert(currentMission);
		});
	});
});