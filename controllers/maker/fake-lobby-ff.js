const axios = require('axios');
const credit = { creator: 'Mayza' };

const fakeLobbyFf = async (req, res) => {
    try {
        const nickname = req.query.nickname || 'Player';
        const versi = req.query.versi || '11';

        const response = await axios.get(`https://api.theresav.biz.id/canvas/lobyff?nickname=${encodeURIComponent(nickname)}&versi=${encodeURIComponent(versi)}&apikey=xPt78`, {
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 30000
        });

        res.set('Content-Type', response.headers['content-type'] || 'image/png');
        res.send(response.data);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { fakeLobbyFf };