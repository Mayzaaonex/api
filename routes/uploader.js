const express = require('express');
const router = express.Router();

const { filegoat } = require('../controllers/uploader/filegoat');
const { gobox } = require('../controllers/uploader/gobox');
const { uguu } = require('../controllers/uploader/uguu');

router.post('/filegoat', filegoat);
router.post('/gobox', gobox);
router.post('/uguu', uguu);

module.exports = router;