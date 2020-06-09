const { getDBReference } = require('../lib/mongo');
const { ObjectId, GridFSBucket } = require('mongodb');
const fs = require('fs');


exports.getAssignments = async function () {
	const db = getDBReference();
	const collection = db.collection('assignments');
	const results = await collection.find({}).toArray();
	return results;
}


/*
 * Function to fetch a specific assignment by ID.
 */
exports.getAssignmentById = async function (id) {
	const db = getDBReference();
	const collection = db.collection('assignments');
	if (!ObjectId.isValid(id)) {
		return null;
	} else {
		const results = await collection
			.find({ _id: new ObjectId(id) })
			.toArray();
		
		return results[0];
	}
}


/*
 * Function to save a submission file into GridFS.
 */
exports.saveSubmissionFile = async function (submission) {
	return new Promise((resolve, reject) => {
		const db = getDBReference();
		const bucket = new GridFSBucket(db, { bucketName: 'submissions' });

		const metadata = {
			contentType: submission.contentType,
			path: submission.path,
			assignmentId: submission.assignmentId,
			studentId: submission.studentId,
			timestamp: (new Date()).toISOString()		// set the timestamp to the current time in ISO 8601 format
		};

		const uploadStream = bucket.openUploadStream(
			submission.filename,
			{ metadata: metadata }
		);

		fs.createReadStream(submission.path).pipe(uploadStream)
			.on('error', err => {
				console.error(err);
				reject(err);
			})
			.on('finish', result => {
				resolve(result._id)
			});
	});
};


/*
 * Function to remove an existing file that was uploaded to the API's local file system.
 */
exports.removeUploadedFile = async function (file) {
	return new Promise((resolve, reject) => {
		fs.unlink(file.path, err => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
};
