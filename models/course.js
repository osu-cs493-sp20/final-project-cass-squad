const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { ObjectId } = require('mongodb');

const CourseSchema = {
  subject: {required: true},
  number: {required: true},
  title: {required: true},
  term: {required: true},
  instructorId: {required: true}
};

exports.CourseSchema = CourseSchema;


exports.getCoursesPage = async function(page){
  const pageSize = 10;

  const db = getDBReference();
  const collection = db.collection('courses');

  const count = await collection.countDocuments();

  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({_id: 1})
    .skip(offset)
    .limit(pageSize)
    .toArray();
  console.log(results);
  return{
    courses: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
};


async function insertNewCourse(course){
  course = extractValidFields(course, CourseSchema);
  const db = getDBReference();
  const collection = db.collection('courses');
  const result = await collection.insertOne(course);
  return result.insertedId;
}
exports.insertNewCourse = insertNewCourse;

async function getCourseById(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}
exports.getCourseById = getCourseById;


exports.deleteCourseById = async function(id){
  const db = getDBReference();
  const collection = db.collection('courses');
  const result = await collection.deleteOne({
    _id: new ObjectId(id)
  });
  return result.deletedCount > 0;
}
