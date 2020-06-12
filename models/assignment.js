const { ObjectId, GridFSBucket } = require('mongodb');
const fs = require('fs');
const validation = require('../lib/validation');
const {
	extractValidFields,
	validateAgainstSchema
} = require('../lib/validation');
const { getDBReference } = require('../lib/mongo');

const AssignmentSchema = {
  //courseId: {required: true},
  title: {required: true},
  points: {required: true},
  due: {required: true},
};

exports.AssignmentSchema = AssignmentSchema;

async function insertNewAssignment(assignment) {
  course = extractValidFields(assignment, AssignmentSchema);
  const db = getDBReference();
  const collection = db.collection('assignments');
  const result = await collection.insertOne(assignment);
  return result.insertedId;
}
exports.insertNewAssignment = insertNewAssignment;



exports.getAssignments = async function () {
	const db = getDBReference();
	const collection = db.collection('assignments');
	const results = await collection.find({}).toArray();
	return results;
};


async function updateAssignmentsById(id, updates) {
  const db = getDBReference();
  const collection = db.collection('assignments');
  let results;
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const query = { _id: new ObjectId(id) };
    if (updates.add) {
      for (var item in updates.add) {
        updates.add[item] = new ObjectId(updates.add[item]);
      }
      const update = { $addToSet: { assignments: { $each: updates.add } } };
      const options = { returnOriginal: false };
      results = await collection.findOneAndUpdate(query, update, options);
    }
    if (updates.remove) {
      for (var item in updates.remove) {
        updates.remove[item] = new ObjectId(updates.remove[item]);
      }
      const update = { $pull: { assignments: { $in: updates.remove } } };
      const options = { returnOriginal: false };
      results = await collection.findOneAndUpdate(query, update, options);
    }
  }
  return results;
}
exports.updateAssignmentsById = updateAssignmentsById;

async function deleteAssignmentById(id) {
  const db = getDBReference();
  const collection = db.collection('assignments');
  const result = await collection.deleteOne({
    _id: new ObjectId(id)
  });
  return result.deletedCount > 0;
}
exports.deleteAssignmentById = deleteAssignmentById;

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
