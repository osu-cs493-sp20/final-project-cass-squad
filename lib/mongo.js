const { MongoClient } = require('mongodb');

// const mongoHost = process.env.MONGO_HOST || "localhost";
// const mongoPort = process.env.MONGO_PORT || 27017;
// const mongoUser = process.env.MONGO_USER || "cass";
// const mongoPassword = process.env.MONGO_PASSWORD || "hunter2";
// const mongoDBName = process.env.MONGO_DATABASE || "cass";

// const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDBName}`;

const mongoHost = 'localhost';
const mongoPort = 27017;
const mongoDBName = 'cloud-dev-final-project';

const mongoUrl = `mongodb://${mongoHost}:${mongoPort}/${mongoDBName}`;

let db = null;

exports.connectToDB = function (callback) {
	MongoClient.connect(mongoUrl, { userInifiedTopology: true }, (err, client) => {
		if (err) {
			throw err;
		}
		db = client.db(mongoDBName);
		callback();
	});
};

exports.getDBReference = function () {
	return db;
};
