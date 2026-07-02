const axios = require('axios');
const credit = { creator: 'Mayzaa' };

const brat = async (req, res) => {
    try {
        const text = req.query.text || 'Hai';
        if (!text) return res.json({ ...credit, status: false, message: 'Parameter text diperlukan' });

        const response = await axios.get('https://api.yupra.my.id/api/image/brat', {
            params: { text },
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 30000
        });

        res.set('Content-Type', response.headers['content-type'] || 'image/png');
        res.set('Content-Length', response.data.length);
        res.send(response.data);

    } catch (error) {
        res.json({ ...credit, status: false, message: 'Gagal generate brat' });
    }
};

module.exports = { brat };