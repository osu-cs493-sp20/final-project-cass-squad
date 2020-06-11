const router = require('express').Router();

const { getSubmissions, getFileInfoById } = require('../models/assignment');

const fileTypes = {
	'application/pdf': 'pdf',
	'application/msword': 'doc',
	'application/zip': 'zip',
	'image/gif': 'gif',
	'image/jpeg': 'jpg',
	'image/png': 'png'
};


/*
 * Route to fetch all file submissions
 */
router.get('/', async (req, res) => {
	try {
		const submissions = await getSubmissions();
		console.log("== Submissions:", submissions);
		res.status(200).send({ submissions: submissions });
	} catch (err) {
		console.log(err);
		res.status(500).send({
			error: "Something went wrong fetching the files. Please try again later."
		});
	}
});


/*
 * Route to fetch information on a specific file given its ID.
 */
router.get('/:id', async (req, res) => {
	try {
		const file = await getFileInfoById(req.params.id);
		if (file) {
			console.log("== Submission:", file);
			const responseBody = {
				_id: file._id,
				url: `/media/submissions/${file.filename}`,
				contentType: fileTypes[file.metadata.contentType],
				assignmentId: file.metadata.assignmentId,
				studentId: file.metadata.studentId,
				timestamp: file.metadata.timestamp
			};
			res.status(200).send(responseBody);
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});

module.exports = router;
