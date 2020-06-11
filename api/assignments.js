const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');

const {
	getAssignments,
	saveSubmissionFile,
	removeUploadedFile,
	getFilesPageByAssignmentId
} = require('../models/assignment');

const fileTypes = {
	'application/pdf': 'pdf',
	'application/msword': 'doc',
	'application/zip': 'zip',
	'image/gif': 'gif',
	'image/jpeg': 'jpg',
	'image/png': 'png'
};


/*
 * Multer middleware function to upload files to the local file system.
 */
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


/*
 * Route to fetch all assignments (not yet paginated)
 */
router.get('/', async (req, res) => {
	try {
		const assignments = await getAssignments();
		res.status(200).send({ assignments: assignments });
	} catch (err) {
		console.log(err);
		res.status(500).send({ err });
	}
});


/*
 * Route to fetch all of an assignment's file submissions given its ID.
 */
router.get('/:id/submissions', async (req, res) => {
	const id = req.params.id;
	const page = parseInt(req.query.page) || 1;
	try {
		const submissionsPage = await getFilesPageByAssignmentId(id, page);

		submissionsPage.links = {};
		if (submissionsPage.page < submissionsPage.totalPages) {
			submissionsPage.links.nextPage = `/assignments/${id}/submissions?page=${submissionsPage.page + 1}`;
			submissionsPage.links.lastPage = `/assignments/${id}/submissions?page=${submissionsPage.totalPages}`;
		}
		if (submissionsPage.page > 1) {
			submissionsPage.links.prevPage = `/assignments/${id}/submissions?page=${submissionsPage.page - 1}`;
			submissionsPage.links.firstPage = `/assignments/${id}/submissions?page=1`;
		}

		res.status(200).send(submissionsPage);
	} catch (err) {
		console.log(err);
		res.status(500).send({
			error: `Unable to fetch submissions for assignment with id ${id}.`
		});
	}
});


/*
 * Route to upload a file submission for an assignment given its ID.
 */
router.post('/:id/submissions', upload.single('file'), async (req, res) => {
	if (req.file && req.body && req.body.studentId) {
		// Build file metadata
		const file = {
			contentType: req.file.mimetype,
			filename: req.file.filename,
			path: req.file.path,
			assignmentId: req.params.id,
			studentId: req.body.studentId
		};

		// Save file to GridFS then remove from local file system
		const id = await saveSubmissionFile(file);
		await removeUploadedFile(req.file);

		res.status(201).send({ id: id });
	} else {
		res.status(400).send({
			error: "Request body needs a 'file' submission and the 'studentId' field."
		});
	}
});

module.exports = router;
