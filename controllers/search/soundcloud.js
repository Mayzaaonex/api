const axios = require('axios');
const credit = { creator: 'Mayza' };
const CLIENT_ID = 'KKzJxmw11tYpCs6T24P4uUYhqmjalG6M';

const soundcloud = async (req, res) => {
    try {
        const query = req.query.q || '';
        let limit = parseInt(req.query.limit) || 10;
        if (![5,10,15,20].includes(limit)) limit = 10;
        if (!query) return res.json({ ...credit, status: false, message: 'Parameter q wajib diisi' });

        const response = await axios.get('https://api-mobi.soundcloud.com/search', {
            params: { q: query, client_id: CLIENT_ID, stage: '' },
            headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36' },
            timeout: 15000
        });

        const collection = response.data?.collection || [];
        const results = [];

        for (const item of collection) {
            if (item.kind !== 'track') continue;

            let downloadUrl = '';
            for (const trans of (item.media?.transcodings || [])) {
                if (trans.format?.protocol === 'progressive') {
                    downloadUrl = trans.url || '';
                    break;
                }
            }

            results.push({
                id: item.id || '',
                title: item.title || '',
                artist: item.user?.username || '',
                duration: Math.round((item.duration || 0) / 1000 * 10) / 10 + 's',
                artwork: item.artwork_url || '',
                permalink: item.permalink_url || '',
                plays: item.playback_count || 0,
                likes: item.likes_count || 0,
                download_url: downloadUrl
            });

            if (results.length >= limit) break;
        }

        res.json({ ...credit, status: true, result: { query, total: response.data?.total_results || 0, count: results.length, tracks: results } });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { soundcloud };