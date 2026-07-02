// controllers/search/tiktok.js
const axios = require('axios');
const credit = { creator: 'Mayza' };

const tiktok = async (req, res) => {
    try {
        const query = req.query.q || '';
        let limit = parseInt(req.query.limit) || 5;
        if (![1,3,5,10].includes(limit)) limit = 5;
        if (!query) return res.json({ ...credit, status: false, message: 'Parameter q wajib diisi' });

        const response = await axios.get('https://www.tikwm.com/api/feed/search', {
            params: { keywords: query, count: limit, cursor: 0, hd: 1 },
            headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Referer': 'https://www.tikwm.com/' },
            timeout: 15000
        });

        const json = response.data;
        if (!json || json.code !== 0) return res.json({ ...credit, status: false, message: json?.msg || 'Request failed' });

        const videos = (json.data?.videos || []).map(v => ({
            id: v.video_id || v.aweme_id,
            description: v.title || '',
            video_url: v.hdplay || v.play,
            cover: v.cover || v.origin_cover,
            duration: parseInt(v.duration) || 0,
            likes: parseInt(v.digg_count) || 0,
            music: { title: v.music_info?.title, author: v.music_info?.author, url: v.music || v.music_info?.play },
            author: { id: v.author?.id, username: v.author?.unique_id, nickname: v.author?.nickname, avatar: v.author?.avatar }
        }));

        res.json({ ...credit, status: true, result: { query, count: videos.length, hasMore: !!json.data?.hasMore, videos } });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { tiktok };