const { ObjectId, GridFSBucket } = require('mongodb');
const fs = require('fs');

const { getDBReference } = require('../lib/mongo');


exports.getAssignmentsPage = async function (page) {
	const db = getDBReference();
	const collection = db.collection('assignments');
	const count = await collection.countDocuments();

	const pageSize = 10;
	const lastPage = Math.ceil(count / pageSize);
	page = page > lastPage ? lastPage : page;
	page = page < 1 ? 1 : page;
	const offset = (page - 1) * pageSize;

	const results = await collection.find({})
		.sort({ _id: 1 })
		.skip(offset)
		.limit(pageSize)
		.toArray();
	
	return {
		assignments: results,
		page: page,
		totalPages: lastPage,
		pageSize: pageSize,
		count: count
	};
}


exports.getAssignmentById = async function (id) {
	const db = getDBReference();
	const collection = db.collection('assignments');

	if (!ObjectId.isValid(id)) {
		return null;
	} else {
		const results = await collection.find({ _id: new ObjectId(id) }).toArray();
		return results[0];
	}
};


/*
 * Function fetch all submissions in the GridFS bucket.
 */
exports.getSubmissions = async function () {
	const db = getDBReference();
	const bucket = new GridFSBucket(db, { bucketName: 'submissions' });
	const results = await bucket.find({}).toArray();
	console.log("== Results:", results);
	return results;
};


/*
 * Function to save a submission file to GridFS.
 */
exports.saveSubmissionFile = async function (file) {
	return new Promise((resolve, reject) => {
		const db = getDBReference();
		const bucket = new GridFSBucket(db, { bucketName: 'submissions' });

		const metadata = {
			contentType: file.contentType,
			path: file.path,
			url: `/media/submissions/${file.filename}`,
			assignmentId: file.assignmentId,
			studentId: file.studentId,
			timestamp: new Date()
		};

		const uploadStream = bucket.openUploadStream(
			file.filename,
			{ metadata: metadata }
		);

		fs.createReadStream(file.path).pipe(uploadStream)
			.on('error', err => {
				console.log(err);
				reject(err);
			})
			.on('finish', result => {
				resolve(result._id);
			});
	});
};


/*
 * Function to remove a file from the API's local file system.
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


/*
 * Function to fetch a submission file's info with a given ID.
 */
exports.getFileInfoById = async function (id) {
	const db = getDBReference();
	const bucket = new GridFSBucket(db, { bucketName: 'submissions' });

	if (!ObjectId.isValid(id)) {
		return null;
	} else {
		const results = await bucket.find({ _id: new ObjectId(id) }).toArray();
		console.log("== Results:", results);

		return results[0];
	}
};


/*
 * Function to fetch a file for download with a given ID.
 */
exports.getFileDownloadStreamById = function (id) {
	const db = getDBReference();
	const bucket = new GridFSBucket(db, { bucketName: 'submissions' });

	if (!ObjectId.isValid(id)) {
		return null;
	} else {
		return bucket.openDownloadStream(new ObjectId(id));
	}
};


/*
 * Function to fetch a file for download with a given file name.
 */
exports.getFileDownloadStreamByName = function (filename) {
	const db = getDBReference();
	const bucket = new GridFSBucket(db, { bucketName: 'submissions' });
	return bucket.openDownloadStreamByName(filename);
};


/*
 * Function to fetch all submission files for a specific assignment given its ID.
 */
exports.getFilesPageByAssignmentId = async function (id, page) {
	const db = getDBReference();
	const collection = db.collection('submissions.files');

	if (!ObjectId.isValid(id)) {
		return null;
	} else {
		const count = await collection.countDocuments();
		const protectedCount = count === 0 ? 1 : count;

		const pageSize = 10;
		const lastPage = Math.ceil(protectedCount / pageSize);
		page = page > lastPage ? lastPage : page;
		page = page < 1 ? 1 : page;
		const offset = (page - 1) * pageSize;

		const results = await collection
			.find({ 'metadata.assignmentId': id })
			.skip(offset)
			.limit(pageSize)
			.toArray();

		console.log("== Results:", results);

		return {
			submissions: results,
			page: page,
			totalPages: lastPage,
			pageSize: pageSize,
			count: count
		};
	}
};
