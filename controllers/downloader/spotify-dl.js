const axios = require('axios');
const credit = { creator: 'Mayza' };

const spotifyDl = async (req, res) => {
    try {
        const url = req.query.url || '';
        if (!url) return res.json({ ...credit, status: false, message: 'Parameter url diperlukan' });

        const response = await axios.post('https://musicfab.io/api/spotify', { url }, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'Accept': '*/*', 'Content-Type': 'application/json',
                'Origin': 'https://musicfab.io', 'Referer': 'https://musicfab.io/'
            },
            timeout: 30000
        });

        const metadata = response.data?.data?.metadata;
        if (!metadata?.download) return res.json({ ...credit, status: false, message: 'Gagal download' });

        res.json({
            ...credit, status: true, input: url, download_url: metadata.download,
            metadata: {
                name: metadata.name || null,
                artist: metadata.artist || null,
                album: metadata.album || null,
                duration: metadata.duration || null,
                image: metadata.image || null
            }
        });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { spotifyDl };