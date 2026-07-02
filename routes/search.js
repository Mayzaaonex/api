const express = require('express');
const router = express.Router();

const { fontSearch } = require('../controllers/search/font-search');
const { happymod } = require('../controllers/search/happymod');
const { lyrics } = require('../controllers/search/lyrics');
const { resepMakanan } = require('../controllers/search/resep-makanan');
const { searchNpm } = require('../controllers/search/search-npm');
const { searchWikipedia } = require('../controllers/search/search-wikipedia');
const { soundcloudArtist } = require('../controllers/search/soundcloud-artist');
const { soundcloud } = require('../controllers/search/soundcloud');
const { tiktokImage } = require('../controllers/search/tiktok-image');
const { tiktok } = require('../controllers/search/tiktok');
const { ytSearch } = require('../controllers/search/yt-search');

router.get('/font-search', fontSearch);
router.get('/happymod', happymod);
router.get('/lyrics', lyrics);
router.get('/resep-makanan', resepMakanan);
router.get('/search-npm', searchNpm);
router.get('/search-wikipedia', searchWikipedia);
router.get('/soundcloud-artist', soundcloudArtist);
router.get('/soundcloud', soundcloud);
router.get('/tiktok-image', tiktokImage);
router.get('/tiktok', tiktok);
router.get('/yt-search', ytSearch);

module.exports = router;