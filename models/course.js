const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { ObjectId } = require('mongodb');
const jsonexport = require('jsonexport');

const CourseSchema = {
  subject: {required: true},
  number: {required: true},
  title: {required: true},
  term: {required: true},
  instructorId: {required: true}
};

exports.CourseSchema = CourseSchema;


exports.getCourses = async function () {
  const db = getDBReference();
  const collection = db.collection('courses');
  const results = await collection.find({}).toArray();
  return results;
}


exports.getCoursesPage = async function(page) {
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


async function insertNewCourse(course) {
  course = extractValidFields(course, CourseSchema);
  const db = getDBReference();
  const collection = db.collection('courses');
  course.instructorId = new ObjectId(course.instructorId);
  course.students = [];
  course.assignments = [];
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

async function getCoursesByInstructorId(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ instructorId: id })
      .toArray();
    return results;
  }
}
exports.getCoursesByInstructorId = getCoursesByInstructorId;

async function getCoursesByStudentId(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ students: { $in: [ id ] } })
      .toArray();
    return results;
  }
}
exports.getCoursesByStudentId = getCoursesByStudentId;

async function deleteCourseById(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  const result = await collection.deleteOne({
    _id: new ObjectId(id)
  });
  return result.deletedCount > 0;
}
exports.deleteCourseById = deleteCourseById;

async function updateCourseById(id, course) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const query = { _id: new ObjectId(id) };
    course.instructorId = new ObjectId(course.instructorId);
    course.students = await getCourseStudentsById(id);
    if (course.students === null) {
      course.students = [];
    }
    course.assignments = await getCourseAssignmentsById(id);
    if (course.assignments === null) {
      course.assignments = [];
    }
    const options = { returnOriginal: false };
    let results = await collection.findOneAndReplace(query, course, options);
    return results.value;
  }
}
exports.updateCourseById = updateCourseById;

async function getCourseStudentsById(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0].students;
  }
}
exports.getCourseStudentsById = getCourseStudentsById;

async function getRoster(id) {
  const students = await getCourseStudentsById(id);
  const db = getDBReference();
  const collection = db.collection('users');
  const json_roster = await collection.find({"_id" : {"$in" : students }}).toArray();
  const csv = await convertToCSV(json_roster);
  return csv;
}
exports.getRoster = getRoster;

async function convertToCSV(students) {
  for (var item in students) {
    students[item]._id = students[item]._id.toString();
    delete students[item].password;
    delete students[item].role;
  }
  const csv = jsonexport(students);
  return csv;
}

async function updateStudentsByCourseId(id, updates) {
  const db = getDBReference();
  const collection = db.collection('courses');
  let results;
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const query = { _id: new ObjectId(id) };
    if (updates.add) {
      for (var item in updates.add) {
        updates.add[item] = new ObjectId(updates.add[item]);
      }
      const update = { $addToSet: { students: { $each: updates.add } } };
      const options = { returnOriginal: false };
      results = await collection.findOneAndUpdate(query, update, options);
    }
    if (updates.remove) {
      for (var item in updates.remove) {
        updates.remove[item] = new ObjectId(updates.remove[item]);
      }
      const update = { $pull: { students: { $in: updates.remove } } };
      const options = { returnOriginal: false };
      results = await collection.findOneAndUpdate(query, update, options);
    }
  }
  return results;
}
exports.updateStudentsByCourseId = updateStudentsByCourseId;

async function getCourseAssignmentsById(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0].assignments;
  }
}
exports.getCourseAssignmentsById = getCourseAssignmentsById;

async function updateAssignmentsByCourseId(id, updates) {
  const db = getDBReference();
  const collection = db.collection('courses');
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
exports.updateAssignmentsByCourseId = updateAssignmentsByCourseId;
