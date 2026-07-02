const axios = require('axios');
const credit = { creator: 'Mayza', author: 'Mayza' };

const kisahNabi = async (req, res) => {
    try {
        const nabi = (req.query.nabi || '').toLowerCase();

        const allowedNabi = [
            'adam', 'idris', 'nuh', 'hud', 'shaleh', 'ibrahim', 'luth', 'ismail', 'ishaq',
            'yaqub', 'yusuf', 'ayyub', 'syuaib', 'musa', 'harun', 'dzulkifli', 'daud',
            'sulaiman', 'ilyas', 'ilyasa', 'yunus', 'zakaria', 'yahya', 'isa', 'muhammad'
        ];

        if (!nabi || !allowedNabi.includes(nabi)) {
            return res.json({ ...credit, status: false, message: 'Parameter nabi tidak valid', options: allowedNabi });
        }

        const response = await axios.get(`https://raw.githubusercontent.com/ZeroChanBot/Api-Freee/a9da6483809a1fbf164cdf1dfbfc6a17f2814577/data/kisahNabi/${nabi}.json`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36', 'Accept': 'application/json' },
            timeout: 15000
        });

        const data = response.data;
        if (!data || !data.name) return res.json({ ...credit, status: false, message: 'Data nabi tidak ditemukan' });

        res.json({
            ...credit,
            status: true,
            result: {
                name: data.name || '',
                lahir: data.thn_kelahiran || '',
                tempat: data.tmp || '',
                usia: data.usia || '',
                description: data.description || ''
            }
        });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { kisahNabi };