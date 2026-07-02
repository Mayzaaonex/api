const axios = require('axios');
const credit = { creator: 'Mayza' };

const removeKeysRecursive = (obj, keysToRemove) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(v => removeKeysRecursive(v, keysToRemove));
    const newObj = {};
    for (const key in obj) {
        if (!keysToRemove.includes(key)) newObj[key] = removeKeysRecursive(obj[key], keysToRemove);
    }
    return newObj;
};

const allInOne = async (req, res) => {
    try {
        const url = req.query.url || '';
        if (!url) return res.json({ ...credit, status: false, message: 'Parameter url wajib diisi' });

        const response = await axios.get('https://api.sxtream.my.id/downloader/aio', {
            params: { url },
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36', 'Accept': 'application/json' },
            timeout: 30000
        });

        const data = removeKeysRecursive(response.data, ['creator', 'Creator', 'author', 'Author']);
        res.json({ ...credit, status: true, result: data });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { allInOne };