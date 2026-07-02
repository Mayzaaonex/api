const axios = require('axios');
const credit = { creator: 'Mayza' };

const textToSpeech = async (req, res) => {
    try {
        const text = req.query.text || '';

        if (!text) {
            return res.json({ status: false, creator: 'Mayza', message: 'Parameter text wajib diisi' });
        }

        const response = await axios.get('https://api.emiliabot.my.id/tools/text-to-speech', {
            params: { text },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            timeout: 30000
        });

        res.json({
            status: response.data?.status || false,
            creator: 'Mayza',
            result: response.data?.result || {}
        });

    } catch (error) {
        res.json({ status: false, creator: 'Mayza', message: error.message });
    }
};

module.exports = { textToSpeech };