const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const validation = require('../lib/validation');
const { ObjectId } = require('mongodb');

const { requireAuthentication } = require('../lib/auth');

const {
	extractValidFields,
	validateAgainstSchema
} = require('../lib/validation');

const {
	AssignmentSchema,
	insertNewAssignment,
	getAssignments,
	getAssignmentById,
	saveSubmissionFile,
	removeUploadedFile,
	getFilesPageByAssignmentId,
	deleteAssignmentById,
	updateAssignmentsById
} = require('../models/assignment');

const {
	getCourses,
	getCoursesByInstructorId,
	getCourseAssignmentsById,
	getCourseStudentsById
} = require('../models/course');
const {
	 getUserById,
	 getUserRole
 } = require('../models/user');

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
 * Route to create and store a new assignment
 */


router.post('/', requireAuthentication, async(req, res) => {
  console.log('==POST /courses');
  console.log('==Req.body', req.body);
  if(!(await getUserRole(req.user) === "admin") || (await getUserRole(req.user) === "instructor")){
    res.status(403).send({
      error: "Unauthorized to add assignment"
    });
  }
  else{
    if(validation.validateAgainstSchema(req.body, AssignmentSchema)){
      const assignment = validation.extractValidFields(req.body, AssignmentSchema);
      try{

        const id = await insertNewAssignment(assignment);
        res.status(201).send({
          id: id
        });
      }
      catch(err){
        console.error(err);
        res.status(500).send({
          error: "Error posting assignment. Please try again later."
        });
      }
    }
    else{
      res.status(400).json({
        error: "Request body is not a valid course object"
      });
    }
  }

});

//Only instructors or admins can edit course info
router.patch('/:id', requireAuthentication, async (req, res) => {
	if(!(await getUserRole(req.user) === "admin") || (await getUserRole(req.user) === "instructor")){
    res.status(403).send({
      error: "Unauthorized to edit assignment"
    });
  }
  else{
  if(validation.validateAgainstSchema(req.body, AssignmentSchema)){
    const assignment = validation.extractValidFields(req.body, AssignmentSchema);
    try{
      const id = await updateAssignmentsById(req.params.id, assignment);
      res.status(201).send(id);
    }
    catch(err){
      console.error(err);
      res.status(500).send({
        error: "Error updating assignment. Please try again later."
      });
    }
  }
  else{
    res.status(400).json({
      error: "Request body is not a valid course object"
    });
  }
}
});

//must be an admin to delete a course
router.delete('/:id', requireAuthentication, async(req, res) => {
	if(!(await getUserRole(req.user) === "admin") || (await getUserRole(req.user) === "instructor")){
    res.status(403).send({
      error: "Unauthorized to delete assignment"
    });
  }
  else{
    try{
      //console.log('==Delete detailed /courses' + req.params.id);
      const deleteSuccessful = await deleteAssignmentById(req.params.id);
      if(deleteSuccessful){
        res.status(204).end();
      }
      else{
        next();
      }
    }
    catch(err){
      console.error(err);
      res.status(500).send({
        error: "Error deleting assignment. Please try again later."
      });
    }
  }
});


/*
 * Route to fetch a specific assignment with a given ID.
 */
router.get('/:id', async (req, res, next) => {
	try {
		const assignment = await getAssignmentById(req.params.id);
		if (assignment) {
			res.status(200).send(assignment);
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		res.status(500).send({
			error: "Unable to fetch assignment. Please try again later."
		});
	}
});


/*
 * Route to fetch all of an assignment's file submissions given its ID.
 * Only admins and instructors teaching the course for the assignment are allowed to fetch.
 */
router.get('/:id/submissions', requireAuthentication, async (req, res, next) => {
	const id = req.params.id;

	let user, courses, isValidInstructor = false;
	try {
		// Fetch current user from authentication
		user = await getUserById(req.user);
		if (user) {
			// Fetch user's courses if they are an instructor
			if (user.role === 'instructor') {
				try {
					// Fetch courses based on instructor id
					courses = await getCoursesByInstructorId(user._id);
					console.log("== Courses:", courses);
					if (courses) {
						// Loop through each course the instructor teaches
						for (let i = 0; i < courses.length; i++) {
							const assignments = await getCourseAssignmentsById(courses[i]._id);
							console.log("== Assignments:", assignments);
							for (let j = 0; j < assignments.length; j++) {
								if (assignments[j].toString() === id) {
									console.log("> Found assignment, exiting loops...");
									isValidInstructor = true;
									break;
								}
							}
							if (isValidInstructor) {
								break;
							}
						}
					} else {
						next();
					}
				} catch (err) {
					console.log(err);
					res.status(500).send({
						error: "Unable to fetch the course for this assignment. Please try again later."
					});
				}
			}
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		res.status(500).send({
			error: "Unable to fetch current user. Please try again later."
		});
	}

	// Continue fetching process for submissions
	if (user && user.role === 'admin' || isValidInstructor) {
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
	} else {
		res.status(403).send({
			error: "The request was not made by an authenticated User."
		});
	}
});


/*
 * Route to upload a file submission for an assignment given its ID.
 */
router.post('/:id/submissions', upload.single('file'), requireAuthentication, async (req, res, next) => {
	const id = req.params.id;
	let user, courses, courseId, isValidStudent = false;
	try {
		// Fetch current user from authentication
		user = await getUserById(req.user);
		if (user) {
			if (user.role === 'student') {
				try {
					courses = await getCourses();
					console.log("== Courses:", courses);
					if (courses) {
						for (let i = 0; i < courses.length; i++) {
							courseId = null;
							const assignments = await getCourseAssignmentsById(courses[i]._id);
							console.log("== Assignments:", assignments);
							for (let j = 0; j < assignments.length; j++) {
								if (assignments[j].toString() === id) {
									const students = await getCourseStudentsById(courses[i]._id);
									console.log("== Students:", students);
									for (let k = 0; k < students.length; k++) {
										if (students[k].toString() === user._id.toString()) {
											isValidStudent = true;
											break;
										}
									}
									if (isValidStudent) {
										break;
									}
								}
							}
						}
					} else {
						next();
					}
				} catch (err) {
					console.log(err);
					res.status(500).send({
						error: "Unable to fetch courses"
					})
				}
			}
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		res.status(500).send({
			error: "Unable to fetch current user. Please try again later."
		});
	}

	if (user && isValidStudent) {
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
	} else {
		res.status(403).send({
			error: "The request was not made by an authenticated User."
		});
	}
});

module.exports = router;
