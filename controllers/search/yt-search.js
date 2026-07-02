// controllers/search/yt-search.js
const axios = require('axios');
const credit = { creator: 'Mayza' };

const ytSearch = async (req, res) => {
    try {
        const query = req.query.q || '';
        if (!query) return res.json({ ...credit, status: false, message: 'Parameter q wajib diisi' });

        const response = await axios.get('https://api-varhad.my.id/search/youtube', {
            params: { q: query },
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
            timeout: 15000
        });

        const removeKeys = (obj) => {
            if (typeof obj !== 'object' || obj === null) return obj;
            if (Array.isArray(obj)) return obj.map(removeKeys);
            const newObj = {};
            for (const key in obj) {
                if (!['creator', 'Creator', 'author', 'Author'].includes(key)) newObj[key] = removeKeys(obj[key]);
            }
            return newObj;
        };

        res.json({ ...credit, status: true, result: removeKeys(response.data) });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { ytSearch };