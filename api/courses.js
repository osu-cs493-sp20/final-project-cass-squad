const router = require('express').Router();
const validation = require('../lib/validation');
const { CourseSchema,
        insertNewCourse,
        getCoursesPage,
        getCourseById,
        deleteCourseById,
        getCourseStudentsById,
        updateStudentsByCourseId,
        updateAssignmentsByCourseId,
        getCourseAssignmentsById,
        getRoster,
        updateCourseById } = require('../models/course');

const {
  UserSchema,
  insertNewUser,
  validateUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  getUserRole
} = require('../models/user');

const {
  generateAuthToken,
  requireAuthentication,
  maybeAuthentication
} = require('../lib/auth');

const {
  applyRateLimit,
  getUserTokenBucket,
  saveUserTokenBucket
} = require('../lib/limiting');

router.use(applyRateLimit);

router.get('/', async(req, res) => {
  try{
    console.log('==GET /courses');
    const coursePage = await getCoursesPage(parseInt(req.query.page) || 1);
    coursePage.links = {};
    if (coursePage.page < coursePage.totalPages) {
      coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}`;
      coursePage.links.lastPage = `/courses?page=${coursePage.totalPages}`;
    }
    if (coursePage.page > 1) {
      coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}`;
      coursePage.links.firstPage = '/courses?page=1';
    }
    res.status(200).send(coursePage);
  }
  catch(err){
    console.error(err);
    res.status(500).send({
      error: "Error fetching courses. Please try again later."
    });
  }
});

//must be admin to post new course
router.post('/', requireAuthentication, async(req, res) => {
  console.log('==POST /courses');
  console.log('==Req.body', req.body);
  if(!(await getUserRole(req.user) === "admin")){
    res.status(403).send({
      error: "Unauthorized to create course"
    });
  }
  else{
    if(validation.validateAgainstSchema(req.body, CourseSchema)){
      const course = validation.extractValidFields(req.body, CourseSchema);
      try{

        const id = await insertNewCourse(course);
        res.status(201).send({
          id: id
        });
      }
      catch(err){
        console.error(err);
        res.status(500).send({
          error: "Error posting courses. Please try again later."
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

// Anyone can get course info
router.get('/:id', async(req, res) => {
  try{
    console.log('==GET detailed /courses' + req.params.id);
    const course = await getCourseById(req.params.id);
    if (course) {
      res.status(200).send(course);
    } else {
      next();
    }
  }
  catch(err){
    console.error(err);
    res.status(500).send({
      error: "Error fetching course. Please try again later."
    });
  }
});

//Only instructors or admins can edit course info
router.patch('/:id', async (req, res) => {
  if(validation.validateAgainstSchema(req.body, CourseSchema)){
    const course = validation.extractValidFields(req.body, CourseSchema);
    try{
      const id = await updateCourseById(req.params.id, course);
      res.status(201).send(id);
    }
    catch(err){
      console.error(err);
      res.status(500).send({
        error: "Error updating course. Please try again later."
      });
    }
  }
  else{
    res.status(400).json({
      error: "Request body is not a valid course object"
    });
  }
});

//must be an admin to delete a course
router.delete('/:id', requireAuthentication, async(req, res) => {
  if(!(await getUserRole(req.user) === "admin")){
    res.status(403).send({
      error: "Unauthorized to create course"
    });
  }
  else{
    try{
      console.log('==Delete detailed /courses' + req.params.id);
      const deleteSuccessful = await deleteCourseById(req.params.id);
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
        error: "Error deleting course. Please try again later."
      });
    }
  }
});

router.get('/:id/students', async (req, res) => {
  try {
    const students = await getCourseStudentsById(req.params.id);
    res.status(200).send({
      "students": students
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching students. Please try again later."
    });
  }
});

router.post('/:id/students', async (req, res) => {
  try {
    if (req.body && (req.body.add || req.body.remove)) {
      const updatedCourse = await updateStudentsByCourseId(req.params.id, req.body);
      res.status(200).send(updatedCourse.value);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error adding students. Please try again later."
    });
  }
});

router.get('/:id/roster', async (req, res) => {
  try {
    const csv = await getRoster(req.params.id);
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching roster. Please try again later."
    });
  }
});

router.get('/:id/assignments', async (req, res) => {
  try {
    const assignments = await getCourseAssignmentsById(req.params.id);
    res.status(200).send({
      "assignments": assignments
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching assignments. Please try again later."
    });
  }
});

router.post('/:id/assignments', async (req, res) => {
  try {
    if (req.body && (req.body.add || req.body.remove)) {
      const updatedCourse = await updateAssignmentsByCourseId(req.params.id, req.body);
      res.status(200).send(updatedCourse.value);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error adding assignments. Please try again later."
    });
  }
});

module.exports = router;
