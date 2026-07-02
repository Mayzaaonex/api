const express = require('express');
const router = express.Router();

const { tiktok } = require('../controllers/downloader/tiktok');
const { ytdl } = require('../controllers/downloader/ytdl');
const { instagram } = require('../controllers/downloader/instagram');
const { allInOne } = require('../controllers/downloader/all-in-one');
const { pinterestDownload } = require('../controllers/downloader/pinterest-download');
const { soundcloud } = require('../controllers/downloader/soundcloud');
const { spotifyDl } = require('../controllers/downloader/spotify-dl');
const { spotiplay } = require('../controllers/downloader/spotiplay');
const { stickerly } = require('../controllers/downloader/stickerly');
const { terabox } = require('../controllers/downloader/terabox');
const { tiktokv2 } = require('../controllers/downloader/tiktokv2');
const { twitter } = require('../controllers/downloader/twitter');
const { ytplay } = require('../controllers/downloader/ytplay');

router.get('/tiktok', tiktok);
router.get('/ytdl', ytdl);
router.get('/instagram', instagram);
router.get('/all-in-one', allInOne);
router.get('/pinterest-download', pinterestDownload);
router.get('/soundcloud', soundcloud);
router.get('/spotify-dl', spotifyDl);
router.get('/spotiplay', spotiplay);
router.get('/stickerly', stickerly);
router.get('/terabox', terabox);
router.get('/tiktokv2', tiktokv2);
router.get('/twitter', twitter);
router.get('/ytplay', ytplay);

module.exports = router;