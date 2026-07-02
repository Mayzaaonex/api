const axios = require('axios');

const fakedev = async (req, res) => {
    try {
        const nama = (req.query.nama || 'Mayza').trim();
        const bio = (req.query.bio || '@Mayzaapi').trim();
        const fotourl = (req.query.fotourl || '').trim();
        if (!fotourl) return res.json({ status: false, creator: 'Mayza', msg: 'fotourl diperlukan' });

        const response = await axios.get('https://api-Mayza.vercel.app/maker/fakedev', {
            params: { urlfoto: fotourl, text1: nama, text2: bio },
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'image/png' },
            timeout: 30000
        });

        res.set('Content-Type', response.headers['content-type'] || 'image/png');
        res.send(response.data);

    } catch (error) {
        res.json({ status: false, creator: 'Mayza', msg: error.message });
    }
};

module.exports = { fakedev };
