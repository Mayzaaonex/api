const axios = require('axios');
const credit = { creator: 'Mayzaa' };

const removeKeys = (obj, keysToRemove) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(v => removeKeys(v, keysToRemove));
    const newObj = {};
    for (const key in obj) {
        if (!keysToRemove.includes(key)) newObj[key] = removeKeys(obj[key], keysToRemove);
    }
    return newObj;
};

const wormGpt = async (req, res) => {
    try {
        const prompt = req.query.prompt || '';
        if (!prompt) return res.json({ ...credit, status: false, message: 'Parameter prompt wajib diisi' });

        const response = await axios.get('https://apiz.xhclinton.me/api/ai/wormgpt', {
            params: { apikey: 'toxicapis', prompt },
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36' },
            timeout: 30000
        });

        const keysToRemove = ['creator', 'Creator', 'Creathor', 'author', 'Author', 'apikey', 'APIKey', 'api_key', 'status', 'Status'];
        const cleaned = removeKeys(response.data, keysToRemove);

        res.json({ ...credit, status: true, result: cleaned });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { wormGpt };