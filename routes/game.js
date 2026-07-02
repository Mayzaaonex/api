const express = require('express');
const router = express.Router();

const { allGame1 } = require('../controllers/game/all-game-1');
const { allGame2 } = require('../controllers/game/all-game-2');
const { cerdasCermat } = require('../controllers/game/cerdas-cermat');
const { matematika } = require('../controllers/game/matematika');

router.get('/all-game-1', allGame1);
router.get('/all-game-2', allGame2);
router.get('/cerdas-cermat', cerdasCermat);
router.get('/matematika', matematika);

module.exports = router;