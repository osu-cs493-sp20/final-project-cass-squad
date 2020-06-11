const router = require('express').Router();

//router.use('/assignments', require('./assignments'));
router.use('/courses', require('./courses'));
router.use('/users', require('./users'));
router.use('/assignments', require('./assignments'));
router.use('/submissions', require('./submissions'));
router.use('/media', require('./media'));

module.exports = router;
