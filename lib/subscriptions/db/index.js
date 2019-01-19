const Datastore = require('nedb');
const db = {};
db.missions = new Datastore({ filename: './db/missions.json', autoload: true });
db.assignments = new Datastore({ filename: './db/assignments.json', autoload: true });

const Mission = require('../models/mission');

const DB = function(args) {
	this.clearStores = function(next) {
		db.missions.remove({}, { multi: true }, function() {
			db.assignments.remove({}, { multi: true }, next);
		});
	};

	this.getMissionByLaunchDate = function(launchDate, next) {
		db.missions.find({ launchDate }, function(err, missions) {
			if (err) {
				next(err);
			}
			const mission = missions.length > 0 ? new Mission(missions[0]) : null;
			next(null, mission);
		});
	};
	
	this.createNextMission = function(args, next) {
		const newMission = new Mission();
		db.missions.insert(newMission, next);
	};
	
	this.saveAssignment = function(args, next) {
		db.assignments.insert(args, next);
	};
}

module.exports = DB;