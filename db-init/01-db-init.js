db.createUser({
  user: "cass",
  pwd: "hunter2",
  roles: [
    {
      role: "readWrite",
      db: "cass",
    },
  ],
});

db.courses.insertMany([
  {
    "subject": "CS",
    "number": 160,
    "title": "Intro To Comp Sci",
    "term": "sp19",
    "instructorId": "1"
  },
  {
    "subject": "CS",
    "number": 161,
    "title": "Intro To Comp Sci I",
    "term": "sp19",
    "instructorId": "1"
  },
  {
    "subject": "CS",
    "number": 162,
    "title": "Intro To Comp Sci II",
    "term": "sp19",
    "instructorId": "1"
  },
  {
    "subject": "CS",
    "number": 261,
    "title": "Data Structures",
    "term": "sp19",
    "instructorId": "2"
  },
  {
    "subject": "CS",
    "number": 271,
    "title": "Computer Architecture and Assembly Language",
    "term": "sp19",
    "instructorId": "3"
  },
  {
    "subject": "CS",
    "number": 290,
    "title": "Web Development",
    "term": "sp19",
    "instructorId": "2"
  },
  {
    "subject": "CS",
    "number": 325,
    "title": "Analysis of Algorithms",
    "term": "sp19",
    "instructorId": "4"
  },
  {
    "subject": "CS",
    "number": 344,
    "title": "Operating Systems I",
    "term": "sp19",
    "instructorId": "5"
  },
  {
    "subject": "CS",
    "number": 372,
    "title": "Computer Networks",
    "term": "sp19",
    "instructorId": "3"
  },
  {
    "subject": "CS",
    "number": 444,
    "title": "Operating Systems II",
    "term": "sp19",
    "instructorId": "6"
  },
  {
    "subject": "CS",
    "number": 475,
    "title": "Intro To Parallel Programming",
    "term": "sp19",
    "instructorId": "7"
  },
  {
    "subject": "CS",
    "number": 492,
    "title": "Mobile Application Development",
    "term": "sp19",
    "instructorId": "2"
  },
  {
    "subject": "CS",
    "number": 493,
    "title": "Cloud Application Development",
    "term": "sp19",
    "instructorId": "6"
  }
]);
