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

const stickerly = async (req, res) => {
    try {
        const query = req.query.query || '';
        if (!query) return res.json({ ...credit, status: false, message: 'Parameter query diperlukan' });

        const response = await axios.post('https://api.sticker.ly/v4/stickerPack/smartSearch', {
            keyword: query,
            enabledKeywordSearch: true,
            filter: { extendSearchResult: false, sortBy: 'RECOMMENDED', languages: ['ALL'], minStickerCount: 5, searchBy: 'ALL', stickerType: 'ALL' }
        }, {
            headers: { 'User-Agent': 'androidapp.stickerly/3.31.0 (M2006C3LG; U; Android 29; in-ID; id;)', 'Content-Type': 'application/json' },
            timeout: 30000
        });

        const result = removeKeysRecursive(response.data, ['Creator', 'author', 'Author']);
        res.json({ ...credit, status: true, input: query, result });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { stickerly };