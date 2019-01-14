const sinon = require('sinon');
const assert = require('assert');
const Mission = require('../models/mission');
const MissionControl = require('../models/mission_control');
const Helpers = require('./helpers');


describe('Mission Planning', function() {
	var missionControl, db;

	before(function() {
		db =  Helpers.stubDB();
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
			assert(db.getMissionByLaunchDate.called);
		});
	});

	describe('Current Mission exists', function() {
		var currentMission;
		before(function(done) {
			db.getMissionByLaunchDate.restore();
			sinon.stub(db, 'getMissionByLaunchDate').yields(null, { id: 1000 });
			missionControl.currentMission(function(err, res) {
				currentMission = res;
				done();
			});
		});

		it('it is created if none exist', function() {
			assert(currentMission);
			assert(db.getMissionByLaunchDate.called);
		});
	});
});