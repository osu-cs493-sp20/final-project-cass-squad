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
        getRoster } = require('../models/course');

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

router.post('/', async(req, res) => {
  console.log('==POST /courses');
  console.log('==Req.body', req.body);
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
});

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

router.patch('/:id', async (req, res) => {
  
});

router.delete('/:id', async(req, res) => {
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
