const { Router } = require('express');
const router = Router();
const client = require('./client');
const cloudinary = require('./cloudinary');
const admin = require('./admin');
const session = require('./session')

router.use('/client', client);
router.use('/cloudinary', cloudinary);
router.use('/admin', admin);
router.use('/session', session)

module.exports = router;
