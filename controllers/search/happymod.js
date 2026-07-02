const axios = require('axios');

const happymod = async (req, res) => {
    try {
        let query = req.query.q || '';
        if (!query) query = (req.query.que || '') + (req.query.ry || '');
        if (!query) return res.json({ status: false, creator: 'Mayza', message: 'Parameter q wajib diisi' });

        const response = await axios.get('https://api.lexcode.biz.id/api/search/happymod', {
            params: { q: query },
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 35000
        });

        const data = response.data;
        let finalStatus = true, finalResult;

        if (data.status === false) {
            finalStatus = false;
            finalResult = { message: (data.message || data.msg || 'Search Failed').replace(/lexcode|❌/gi, '').trim() };
        } else {
            finalResult = data.result || data.data || data;
        }

        const clean = (obj) => {
            if (typeof obj !== 'object' || obj === null) return obj;
            if (Array.isArray(obj)) return obj.map(clean);
            const newObj = {};
            for (const key in obj) {
                if (!['creator', 'author', 'attribution', 'code'].includes(key)) newObj[key] = clean(obj[key]);
            }
            return newObj;
        };

        res.json({ status: finalStatus, creator: 'Mayza', result: clean(finalResult) });

    } catch (error) {
        res.json({ status: false, creator: 'Mayza', message: error.message });
    }
};

module.exports = { happymod };