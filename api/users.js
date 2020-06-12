const router = require('express').Router();
const validation = require('../lib/validation');
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

router.get('/all', async(req, res) => {
  try{
    const results = await getAllUsers();
    res.status(200).send(results);
  }
  catch(err){
    console.error(" -- ERROR", err);
  }
});

router.post('/', maybeAuthentication, async (req, res) => {
  console.log("== Req.body:", req.body);
  if (validation.validateAgainstSchema(req.body, UserSchema)) {
    try {
      if(req.user == -1 || !(await getUserRole(req.user) === "admin")){
        req.body.role = "student";
      }
      const id = await insertNewUser(req.body);
      res.status(201).send({
        _id: id,
        role: req.body.role
      });
    } catch (err) {
      console.error("  -- Error:", err);
      res.status(500).send({
        error: "Error inserting new user.  Try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body does not contain a valid User."
    });
  }
});

router.post('/login', async (req, res) => {
  console.log("==Req.body:", req.body);
  if (req.body && req.body.email && req.body.password) {
      try {
        const authenticated = await validateUser(
          req.body.email,
          req.body.password
        );
        if (authenticated) {
          const authenticatedUser = await getUserByEmail(req.body.email);
          console.log("==Authenticated User:", authenticatedUser);
          const token = generateAuthToken(authenticatedUser._id);
          res.status(200).send({
            token: token
          });
        } else {
          res.status(401).send({
            error: "Invalid authentication credentials."
          })
        }
      } catch (err) {
        console.error("  -- error:", err);
        res.status(500).send({
          error: "Error logging in.  Try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body needs a user ID and password."
      });
    }
});

router.get('/:id', requireAuthentication, async (req, res) => {
  if (!(await getUserRole(req.user) === "admin") && (req.user !== req.params.id)) {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
    } else {
      try {
        const user = await getUserById(req.params.id);
        if (user) {
          res.status(200).send(user);
        } else {
          next();
        }
      } catch (err) {
        console.error("  -- Error:", err);
        res.status(500).send({
          error: "Error fetching user.  Try again later."
        });
      }
    }
});




module.exports = router;
