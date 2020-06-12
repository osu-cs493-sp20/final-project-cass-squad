const router = require('express').Router();

const { getFileDownloadStreamById, getFileDownloadStreamByName } = require('../models/assignment');

const fileTypes = {
	'application/pdf': 'pdf',
	'application/msword': 'doc',
	'application/zip': 'zip',
	'image/gif': 'gif',
	'image/jpeg': 'jpg',
	'image/png': 'png'
};


/*
 * Route to fetch a submission file for download.
 */
router.get('/submissions/:filename', (req, res, next) => {
	getFileDownloadStreamByName(req.params.filename)
		.on('error', err => {
			console.log(err);
			if (err.code === 'ENOENT') {
				next();
			} else {
				next(err);
			}
		})
		.on('file', file => {
			console.log("== File:", file);
			res.status(200).type(fileTypes[file.metadata.contentType]);
		})
		.pipe(res);
});

module.exports = router;
