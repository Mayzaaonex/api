// controllers/search/tiktok-image.js
const axios = require('axios');
const credit = { creator: 'Mayza' };

const tiktokImage = async (req, res) => {
    try {
        const query = req.query.q || '';
        if (!query) return res.json({ ...credit, status: false, message: 'Parameter q wajib diisi' });

        const response = await axios.get('https://api.cuki.biz.id/api/search/tiktokfoto', {
            params: { apikey: 'cuki-x', query },
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
            timeout: 15000
        });

        const results = response.data?.data?.results || [];
        if (!results.length) return res.json({ ...credit, status: false, message: 'Tidak ada hasil' });

        const randomItem = results[Math.floor(Math.random() * results.length)];
        res.json({ ...credit, status: true, result: { title: randomItem.title, images: randomItem.images || [], total_images: (randomItem.images || []).length } });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { tiktokImage };