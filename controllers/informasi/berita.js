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

const berita = async (req, res) => {
    try {
        const source = req.query.source || 'antara';

        const endpoints = {
            antara: 'https://api.siputzx.my.id/api/berita/antara',
            cnn: 'https://api.siputzx.my.id/api/berita/cnn',
            kompas: 'https://api.siputzx.my.id/api/berita/kompas',
            merdeka: 'https://api.siputzx.my.id/api/berita/merdeka',
            sindonews: 'https://api.siputzx.my.id/api/berita/sindonews'
        };

        if (!endpoints[source]) {
            return res.json(removeKeysRecursive({ ...credit, status: false, message: 'Sumber tidak valid' }, ['creator', 'Creator', 'author', 'Author']));
        }

        const response = await axios.get(endpoints[source], {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 15000
        });

        let data = { ...credit, status: !!response.data, source, result: response.data };
        data = removeKeysRecursive(data, ['creator', 'Creator', 'author', 'Author']);
        res.json(data);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { berita };