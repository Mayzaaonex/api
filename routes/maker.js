const express = require("express");
const router = express.Router();

const { brat } = require("../controllers/maker/brat");
// const { fakeDana } = require('../controllers/maker/fake-dana'); // PENDING
// const { fakeLobbyFfSquad } = require('../controllers/maker/fake-lobby-ff-squad'); // PENDING
const { fakeLobbyFf } = require("../controllers/maker/fake-lobby-ff");
const { fakeLobbyMl } = require("../controllers/maker/fake-lobby-ml");
const { fakeNgl } = require("../controllers/maker/fake-ngl");
const { fakeOvo } = require("../controllers/maker/fake-ovo");
const { fakeStoryIg } = require("../controllers/maker/fake-story-ig");
const { fakedev } = require("../controllers/maker/fakedev");
const { nasaLandsat } = require("../controllers/maker/nasa-landsat");
const { nokiaMsg } = require("../controllers/maker/nokia-msg");
const { playButton } = require("../controllers/maker/play-button");
const { sertifikatNasa } = require("../controllers/maker/sertifikat-nasa");
const { smeme } = require("../controllers/maker/smeme");
const { statusWa } = require("../controllers/maker/status-wa");
const { tanyaUstadz } = require("../controllers/maker/tanyaustadz");
const { wanted } = require("../controllers/maker/wanted");
const { wasted } = require("../controllers/maker/wasted");
const { welcome } = require("../controllers/maker/welcome");
const { windowsQuotes } = require("../controllers/maker/windows-quotes");
const { carbonCode } = require("../controllers/maker/carbon-code");

router.get("/brat", brat);
// router.get('/fake-dana', fakeDana); // PENDING
// router.get('/fake-lobby-ff-squad', fakeLobbyFfSquad); // PENDING
router.get("/fake-lobby-ff", fakeLobbyFf);
router.get("/fake-lobby-ml", fakeLobbyMl);
router.get("/fake-ngl", fakeNgl);
router.get("/fake-ovo", fakeOvo);
router.post("/fake-story-ig", fakeStoryIg);
router.get("/fakedev", fakedev);
router.get("/nasa-landsat", nasaLandsat);
router.get("/nokia-msg", nokiaMsg);
router.get("/play-button", playButton);
router.get("/sertifikat-nasa", sertifikatNasa);
router.get("/smeme", smeme);
router.get("/status-wa", statusWa);
router.get("/tanyaustadz", tanyaUstadz);
router.get("/wanted", wanted);
router.get("/wasted", wasted);
router.post("/welcome", welcome);
router.get("/windows-quotes", windowsQuotes);
router.get("/carbon-code", carbonCode);

module.exports = router;
