const axios = require('axios');
const CLIENT_ID = 'KKzJxmw11tYpCs6T24P4uUYhqmjalG6M';

const soundcloud = async (req, res) => {
    try {
        const url = req.query.url || '';
        if (!url) return res.json({ creator: 'Mayza', status: false, message: 'Parameter url wajib diisi' });

        const resolveRes = await axios.get('https://api-mobi.soundcloud.com/resolve', {
            params: { url, client_id: CLIENT_ID },
            timeout: 30000
        });

        if (!resolveRes.data?.id) return res.json({ creator: 'Mayza', status: false, message: 'Gagal resolve URL' });

        let downloadUrl = '';
        const transcodings = resolveRes.data.media?.transcodings || [];

        for (const trans of transcodings) {
            if (trans.format?.protocol === 'progressive') {
                const transRes = await axios.get(`${trans.url}?client_id=${CLIENT_ID}`, { timeout: 30000 });
                downloadUrl = transRes.data?.url || '';
                if (downloadUrl) break;
            }
        }

        if (!downloadUrl) return res.json({ creator: 'Mayza', status: false, message: 'Download URL tidak ditemukan' });

        const audioRes = await axios.get(downloadUrl, { responseType: 'stream', timeout: 60000 });
        res.set('Content-Type', 'audio/mpeg');
        res.set('X-Creator', 'Mayza');
        audioRes.data.pipe(res);

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, message: error.message });
    }
};

module.exports = { soundcloud };