const jwt = require('jsonwebtoken');

const secretKey = 'SuperSecret123';

exports.generateAuthToken = function (id) {
  const payload = { sub: id };
  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
};

exports.requireAuthentication = function (req, res, next) {
  /*
   * Authorization: Bearer <token>
   */
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  const token = authHeaderParts[0] === 'Bearer' ?
    authHeaderParts[1] : null;

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload.sub;
    next();
  } catch (err) {
    console.error("  -- error:", err);
    res.status(401).send({
      error: "Invalid authentication token"
    });
  }
};

exports.maybeAuthentication = function (req, res, next) {
 const authHeader = req.get('Authorization') || '';
 const authHeaderParts = authHeader.split(' ');
 const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;
 try{
   if(token){
     const payload = jwt.verify(token, secretKey);
     req.user = payload.sub;
   }
   else{
     req.user = -1;
   }
   next();
 } catch(err){
   console.log(" -- error:", err);
   res.status(401).send({
     error: "Invalid Authentication token"
   });
 }
};
