const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');


const UserSchema = {
  name: {required: true},
  email: {required: true},
  password: {required: true},
  role: {required: true}
}
exports.UserSchema = UserSchema;

async function insertNewUser(user) {
  user = extractValidFields(user, UserSchema);
  user.password = await bcrypt.hash(
    user.password,
    8
  );
  console.log('== user to insert', user);
  const db = getDBReference();
  const collection = db.collection('users');
  const result = await collection.insertOne(user);
  return result.insertedId;
}
exports.insertNewUser = insertNewUser;

exports.getUserByEmail = async function (email, includePassword) {
  const db = getDBReference();
  const collection = db.collection('users');
  const projection = includePassword ? {} : { password: 0 };
  const results = await collection
      .find({"email": email})
      .project(projection)
      .toArray();
  return results[0];
};

exports.getUserById = async function(id, includePassword){
  const db = getDBReference();
  const collection = db.collection('users');
  const projection = includePassword ? {} : { password: 0 };
  const results = await collection
      .find({_id: new ObjectId(id)})
      .project(projection)
      .toArray();
  return results[0];
};

exports.validateUser = async function(email, password) {
  const user = await exports.getUserByEmail(email, true);
  return user &&
    await bcrypt.compare(password, user.password);
};


exports.getAllUsers = async function(){
  const db = getDBReference();
  const collection = db.collection('users');
  const results = await collection.find({})
  .toArray();
  return results;
}

exports.getUserRole = async function(id){
  const user = await exports.getUserById(id);
  console.log("== USER ROLE:", user.role);
  return user.role;
}
