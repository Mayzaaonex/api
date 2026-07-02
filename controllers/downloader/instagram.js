const axios = require('axios');

const instagram = async (req, res) => {
    try {
        const url = req.query.url || '';
        if (!url) return res.json({ creator: 'Mayzaa', status: false, message: 'Parameter url wajib diisi' });

        const response = await axios.get('https://api.ikyyxd.my.id/download/instagram', {
            params: { apikey: 'kyzz', query: url },
            timeout: 30000
        });

        res.json({ creator: 'Mayza', debug: response.data });

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, message: error.message });
    }
};

module.exports = { instagram };
