const axios = require('axios');

const searchNpm = async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) return res.json({ status: false, message: 'Parameter q tidak boleh kosong', creator: 'Mayza', timestamp: Math.floor(Date.now()/1000), result: null });

        const response = await axios.get('https://api.lexcode.biz.id/api/search/npm', {
            params: { q },
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 15000
        });

        res.json({ status: true, message: 'Berhasil mencari di npm', creator: 'Mayza', timestamp: Math.floor(Date.now()/1000), result: response.data });

    } catch (error) {
        res.json({ status: false, message: 'Gagal mencari di npm', creator: 'Mayza', timestamp: Math.floor(Date.now()/1000), result: null });
    }
};

module.exports = { searchNpm };