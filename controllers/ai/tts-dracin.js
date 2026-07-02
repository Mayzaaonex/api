const axios = require('axios');
const credit = { creator: 'Mayza' };

const ttsDracin = async (req, res) => {
    try {
        const text = req.query.text || '';
        let voiceType = req.query.voice || 'laki';

        const voices = {
            laki: 'id-ID-ArdiNeural',
            perempuan: 'id-ID-GadisNeural'
        };

        if (!voices[voiceType]) voiceType = 'laki';
        const voice = voices[voiceType];

        if (!text) {
            return res.json({ creator: 'Mayza', status: false, message: 'Parameter text wajib diisi' });
        }

        const response = await axios.post('https://crikk.com/api/tts/guest', {
            text: text,
            voice: voice
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg, application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'Origin': 'https://crikk.com',
                'Referer': 'https://crikk.com/'
            },
            responseType: 'arraybuffer',
            timeout: 30000
        });

        res.set('Content-Type', response.headers['content-type'] || 'audio/mpeg');
        res.set('X-Creator', 'Mayza');
        res.send(response.data);

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, message: 'TTS gagal: ' + error.message });
    }
};

module.exports = { ttsDracin };