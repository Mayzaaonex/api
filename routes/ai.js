const express = require('express');
const router = express.Router();

const { chatGpt } = require('../controllers/ai/chat-gpt');
const { gemini } = require('../controllers/ai/gemini');
const { wormGpt } = require('../controllers/ai/worm-gpt');
const { chatday } = require('../controllers/ai/chatday');
const { copilot } = require('../controllers/ai/copilot');
const { promptGenerator } = require('../controllers/ai/prompt-generator');
const { quillbot } = require('../controllers/ai/quillbot');
const { textToSpeech } = require('../controllers/ai/text-to-speech');
const { textToSpeech2 } = require('../controllers/ai/text-to-speech2');
const { transcribe } = require('../controllers/ai/transcribe');
const { ttsDracin } = require('../controllers/ai/tts-dracin');
const { uncensoredAi } = require('../controllers/ai/uncensored-ai');
const { unlimitedAi } = require('../controllers/ai/unlimited-ai');
const { chat: deepai } = require('../controllers/ai/deepai');

router.get('/chat-gpt', chatGpt);
router.get('/gemini', gemini);
router.get('/worm-gpt', wormGpt);
router.get('/chatday', chatday);
router.get('/copilot', copilot);
router.get('/prompt-generator', promptGenerator);
router.get('/quillbot', quillbot);
router.get('/text-to-speech', textToSpeech);
router.get('/text-to-speech2', textToSpeech2);
router.get('/transcribe', transcribe);
router.get('/tts-dracin', ttsDracin);
router.get('/uncensored-ai', uncensoredAi);
router.get('/unlimited-ai', unlimitedAi);
router.get('/deepai', deepai);

module.exports = router;