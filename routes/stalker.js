const express = require('express');
const router = express.Router();

const { igStalk } = require('../controllers/stalker/ig-stalk');
const { ffStalk } = require('../controllers/stalker/ff-stalk');
const { roblox } = require('../controllers/stalker/roblox');
const { tiktok } = require('../controllers/stalker/tiktok');
const { whatsappChannel } = require('../controllers/stalker/whatsapp-channel');

router.get('/ig-stalk', igStalk);
router.get('/ff-stalk', ffStalk);
router.get('/roblox', roblox);
router.get('/tiktok', tiktok);
router.get('/whatsapp-channel', whatsappChannel);

module.exports = router;