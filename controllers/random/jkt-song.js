const axios = require('axios');

const jktSong = async (req, res) => {
    try {
        const apiUrl = 'https://smail.my.id/randomlagujkt48?type=buffer&t=' + Date.now() + Math.floor(Math.random() * 9999);

        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'audio/*', 'Referer': 'https://smail.my.id/' },
            timeout: 30000
        });

        res.set('Content-Type', response.headers['content-type'] || 'audio/mpeg');
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.send(response.data);

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, message: 'Gagal mendapatkan audio JKT48' });
    }
};

module.exports = { jktSong };