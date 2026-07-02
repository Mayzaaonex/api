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

const radioList = async (req, res) => {
    try {
        const country = (req.query.country || 'indonesia').trim().toLowerCase();
        if (!country) {
            return res.json(removeKeysRecursive({ status: false, creator: 'Mayza', input: { country: null }, result: { msg: 'Parameter country diperlukan' } }, ['creator', 'Creator', 'author', 'Author']));
        }

        const slug = country.replace(/\s+/g, '-') + '-stations';
        const url = 'https://mytuner-radio.com/radio/country/' + slug;

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
            timeout: 15000
        });

        const html = response.data;
        const matches = html.match(/"https:\/\/mytuner-radio\.com\/radio\/([^"]+)"/g) || [];
        const stations = [];

        matches.forEach(match => {
            const path = match.replace(/"/g, '').replace('https://mytuner-radio.com/radio/', '');
            if (path.match(/-\d+\/$/)) {
                const name = path.replace(/-(\d+)\/$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
                const idMatch = path.match(/-(\d+)\/$/);
                stations.push({ name, url: match.replace(/"/g, ''), id: idMatch ? idMatch[1] : null });
            }
        });

        const uniqueStations = stations.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);

        let data = {
            status: true,
            creator: 'Mayza',
            input: { country },
            result: { country, total: uniqueStations.length, stations: uniqueStations }
        };
        data = removeKeysRecursive(data, ['creator', 'Creator', 'author', 'Author']);
        res.json(data);

    } catch (error) {
        res.json(removeKeysRecursive({ status: false, creator: 'Mayza', input: { country: req.query.country || '' }, result: { msg: error.message } }, ['creator', 'Creator', 'author', 'Author']));
    }
};

module.exports = { radioList };