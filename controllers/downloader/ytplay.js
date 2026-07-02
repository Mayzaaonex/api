const axios = require('axios');

const ytplay = async (req, res) => {
    try {
        const query = req.query.q || 'mienteme';
        if (!query) return res.json({ status: false, creator: 'Mayza', message: 'Parameter q wajib diisi' });

        const response = await axios.get('https://api.lexcode.biz.id/api/dwn/ytplay', {
            params: { q: query },
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/149.0.0.0 Safari/537.36' },
            timeout: 40000
        });

        const data = response.data;
        if (!data || data.status === false) return res.json({ status: false, creator: 'Mayza', message: 'Gagal fetch audio' });

        const result = data.result || data.data || data;

        const findAudioUrl = (obj) => {
            if (typeof obj !== 'object' || obj === null) return '';
            for (const key in obj) {
                const val = obj[key];
                if (typeof val === 'string' && (val.includes('.mp3') || val.includes('audio')) && val.startsWith('http')) return val;
                if (typeof val === 'object') {
                    const found = findAudioUrl(val);
                    if (found) return found;
                }
            }
            return '';
        };

        const audioUrl = findAudioUrl(result) || result.download || result.url || result.audio || result.audio_url || result.link || '';
        if (!audioUrl?.startsWith('http')) return res.json({ status: false, creator: 'Mayza', message: 'URL audio tidak ditemukan' });

        const audioRes = await axios.get(audioUrl, { responseType: 'stream', timeout: 0, headers: { 'User-Agent': 'Mozilla/5.0' } });
        res.set('Content-Type', 'audio/mpeg');
        res.set('Content-Disposition', `inline; filename="${encodeURIComponent(query)}.mp3"`);
        audioRes.data.pipe(res);

    } catch (error) {
        res.json({ status: false, creator: 'Mayza', message: error.message });
    }
};

module.exports = { ytplay };