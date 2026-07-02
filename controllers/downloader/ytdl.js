const axios = require('axios');
const credit = { creator: 'Mayzaa' };

const ytdl = async (req, res) => {
    try {
        const url = req.query.url || '';
        let type = req.query.type || 'mp4';
        if (!['mp4', 'mp3'].includes(type)) type = 'mp4';
        if (!url) return res.json({ ...credit, status: false, message: 'Parameter url wajib diisi' });

        const AUTH = '20250901majwlqo';
        const response = await axios.post('https://api.vidssave.com/api/contentsite_api/media/parse',
            new URLSearchParams({ auth: AUTH, domain: 'api-ak.vidssave.com', origin: 'source', link: url }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0' }, timeout: 60000 }
        );

        if (!response.data?.status || !response.data?.data) throw new Error(response.data?.message || 'Gagal get video info');

        const info = response.data.data;
        const resources = info.resources || [];
        let selected = null;

        if (type === 'mp3') {
            selected = resources.find(r => r.type === 'audio') || 
                      resources.find(r => r.type === 'video' && r.quality === '360P') || 
                      resources[0];
        } else {
            selected = resources.find(r => r.type === 'video' && r.format === 'MP4' && r.quality === '480P') ||
                      resources.find(r => r.type === 'video' && r.format === 'MP4') ||
                      resources[0];
        }

        if (!selected?.download_url) throw new Error('No resource found');

        res.json({
            ...credit,
            status: true,
            result: {
                title: info.title || 'YouTube Video',
                download_url: selected.download_url,
                type,
                size: Math.round((selected.size || 0) / 1024 / 1024 * 100) / 100 + ' MB',
                quality: selected.quality || 'Unknown'
            }
        });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { ytdl };