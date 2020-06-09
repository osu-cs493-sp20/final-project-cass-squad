const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');

const {
	getAssignments,
	getAssignmentById,
	saveSubmissionFile,
	removeUploadedFile
} = require('../models/assignment');

const fileTypes = {
	'application/pdf': 'pdf',
	'application/msword': 'doc',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
	'application/zip': 'zip',
	'image/gif': 'gif',
	'image/jpeg': 'jpg',
	'image/png': 'png'
};

const upload = multer({
	storage: multer.diskStorage({
		destination: `${__dirname}/uploads`,
		filename: (req, file, callback) => {
			const filename = crypto.pseudoRandomBytes(16).toString('hex');
			const extension = fileTypes[file.mimetype];
			callback(null, `${filename}.${extension}`);
		}
	}),
	fileFilter: (req, file, callback) => {
		callback(null, !!fileTypes[file.mimetype]);
	}
});


router.get('/', async (req, res) => {
	try {
		const assignments = await getAssignments();
		res.status(200).send({ assignments: assignments });
	} catch (err) {
		console.error(err);
		res.status(500).send({
			error: err
		});
	}
});


/*
 *	API endpoint to create a new assignment.
 */
router.post('/', async (req, res) => {

});


/*
 *	API endpoint to fetch an assignment with a given ID.
 */
router.get('/:id', async (req, res) => {

});


/*
 *	API endpoint to update an existing assignment with a given ID.
 */
router.put('/:id', async (req, res) => {

});


/*
 *	API endpoint to delete an existing assignment with a given ID.
 */
router.delete('/:id', async (req, res) => {

});

/*
 *	API endpoint to fetch with a given ID all of an existing assignment's submissions.
 */
router.get('/:id/submissions', async (req, res) => {

});


/*
 *	API endpoint to upload a new submission for an existing assignment with a given ID.
 */
router.post('/:id/submissions', upload.single('file'), async (req, res) => {
	if (req.file && req.body && req.body.assignmentId && req.body.studentId) {
		const assignment = await getAssignmentById(req.params.id);
		if (assignment) {
			const file = {
				contentType: req.file.mimetype,
				filename: req.file.filename,
				path: req.file.path,
				assignmentId: req.body.assignmentId,
				studentId: req.body.studentId
			};
			
			// Save file to GridFS then remove from API's local file system
			const id = await saveSubmissionFile(file);
			await removeUploadedFile(req.file);
			res.status(201).send({ id: id });
		} else {
			res.status(404).send({
				error: "Specified Assignment ID not found."
			});
		}
	} else {
		res.status(400).send({
			error: "The request body was either not present or did not contain a valid Submission object."
		});
	}
});

module.exports = router;
