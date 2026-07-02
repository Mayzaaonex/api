const express = require('express');
const router = express.Router();

const { berita } = require('../controllers/informasi/berita');
const { jadwalTv } = require('../controllers/informasi/jadwal-tv');
const { kisahNabi } = require('../controllers/informasi/kisah-nabi');
const { mlbb } = require('../controllers/informasi/mlbb');
const { radioList } = require('../controllers/informasi/radio-list');
const { radioStream } = require('../controllers/informasi/radio-stream');

router.get('/berita', berita);
router.get('/jadwal-tv', jadwalTv);
router.get('/kisah-nabi', kisahNabi);
router.get('/mlbb', mlbb);
router.get('/radio-list', radioList);
router.get('/radio-stream', radioStream);

module.exports = router;