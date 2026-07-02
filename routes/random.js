const express = require('express');
const router = express.Router();

const { cecan } = require('../controllers/random/cecan');
const { jktSong } = require('../controllers/random/jkt-song');
const { loli } = require('../controllers/random/loli');
const { meme } = require('../controllers/random/meme');
const { quotesIslam } = require('../controllers/random/quotes-islam');
const { randomCouple } = require('../controllers/random/random-couple');
const { randomMemePresiden } = require('../controllers/random/random-meme-presiden');
const { randomPap } = require('../controllers/random/random-pap');
const { randomWallpaper } = require('../controllers/random/random-wallpaper');
const { waifu } = require('../controllers/random/waifu');

router.get('/cecan', cecan);
router.get('/jkt-song', jktSong);
router.get('/loli', loli);
router.get('/meme', meme);
router.get('/quotes-islam', quotesIslam);
router.get('/random-couple', randomCouple);
router.get('/random-meme-presiden', randomMemePresiden);
router.get('/random-pap', randomPap);
router.get('/random-wallpaper', randomWallpaper);
router.get('/waifu', waifu);

module.exports = router;