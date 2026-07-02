const axios = require('axios');
const credit = { creator: 'Mayza' };

const textToSpeech2 = async (req, res) => {
    try {
        const text = req.query.text || '';
        let voiceId = parseInt(req.query.voice) || 2;
        if (voiceId < 0 || voiceId > 10) voiceId = 2;

        if (!text) {
            return res.json({ creator: 'Mayza', status: false, message: 'Parameter text wajib diisi' });
        }

        const xsrfToken = 'eyJpdiI6ImRGNE91Sm5SeUpPRS9kbm03K05xaFE9PSIsInZhbHVlIjoiWmtTMXBZaUVwZFdPTFllek5BR0E4M1RVZXdVcVh0QTZOQytweDMwaFVQZzRwbWpjZU9nNkVtNmlsWlZoVTYwMVV2RHkvYmtlQWluN21mWWxVMEZ6SjE4SDEra0pJbGVlcExEaHNKMnFRdlo0KzVaTXBXM1k5SXROWGNEVTgwOHkiLCJtYWMiOiI5YTMyZjZlNjRjNzU5NDNkMTEzODc0MWVhNDkwMTE2MWZkNmYwOWE4ZTE2NGUyNjg0MGViYWEyOTJhOGFmNGIwIiwidGFnIjoiIn0=';

        const response = await axios.post('https://voice.ai/api/tts/generate', {
            voice_id: voiceId,
            demo_text: text
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg',
                'X-XSRF-TOKEN': xsrfToken
            },
            responseType: 'arraybuffer',
            timeout: 30000
        });

        if (!response.data) {
            return res.json({ creator: 'Mayza', status: false, message: 'TTS gagal' });
        }

        res.set('Content-Type', 'audio/mpeg');
        res.set('X-Creator', 'Mayza');
        res.send(response.data);

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, message: error.message });
    }
};

module.exports = { textToSpeech2 };