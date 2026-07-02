const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "AI Image endpoint ready" });
});

const { image2prompt } = require("../controllers/ai-image/image-2-prompt");
const { quillbotImage } = require("../controllers/ai-image/quillbot");
const { toSketch } = require("../controllers/ai-image/to-skecth");

router.post("/image-2-prompt", image2prompt);
router.get("/quillbot", quillbotImage);
router.post("/to-sketch", toSketch);

module.exports = router;
