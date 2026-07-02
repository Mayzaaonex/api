const axios = require('axios');
const credit = { creator: 'Mayza' };

const BASE_URL = 'https://tools.xrespond.com/api/tiktok';
const USER_AGENTS = [
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'
];

function randomUA() { return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]; }

function extractUsername(input) {
    input = input.trim();
    if (input.startsWith('@')) return input.slice(1);
    if (input.match(/tiktok\.com\/@([^\/\?]+)/)) return input.match(/tiktok\.com\/@([^\/\?]+)/)[1];
    if (input.match(/^https?:\/\//)) return null;
    return input;
}

const removeKeysRecursive = (obj, keysToRemove) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(v => removeKeysRecursive(v, keysToRemove));
    const newObj = {};
    for (const key in obj) {
        if (!keysToRemove.includes(key)) newObj[key] = removeKeysRecursive(obj[key], keysToRemove);
    }
    return newObj;
};

const tiktok = async (req, res) => {
    try {
        const action = req.query.action || '';
        const username = req.query.username || '';

        if (!action) return res.json(removeKeysRecursive({ status: false, creator: 'Mayza', input: { action, username }, result: { msg: "Parameter 'action' diperlukan. Gunakan 'profile' atau 'videos'." } }, ['creator', 'Creator', 'author', 'Author']));
        if (!username) return res.json(removeKeysRecursive({ status: false, creator: 'Mayza', input: { action, username }, result: { msg: "Parameter 'username' diperlukan." } }, ['creator', 'Creator', 'author', 'Author']));

        const extractedUsername = extractUsername(username);
        if (!extractedUsername) return res.json(removeKeysRecursive({ status: false, creator: 'Mayza', input: { action, username }, result: { msg: 'Gagal mengekstrak username dari input.' } }, ['creator', 'Creator', 'author', 'Author']));

        if (action === 'profile') {
            const response = await axios.post(`${BASE_URL}/profile/details`, { profile: extractedUsername }, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Origin': 'https://tikviewr.com', 'Referer': 'https://tikviewr.com/', 'User-Agent': randomUA() },
                timeout: 30000
            });

            const user = response.data?.data?.data?.user || {};
            const stats = response.data?.data?.data?.stats || {};

            const result = {
                id: user.id || null,
                username: user.uniqueId || null,
                nickname: user.nickname || null,
                bio: user.signature || null,
                verified: user.verified || false,
                private: user.privateAccount || false,
                avatar: { thumb: user.avatarThumb, medium: user.avatarMedium, large: user.avatarLarger },
                stats: { followers: stats.followerCount || 0, following: stats.followingCount || 0, likes: stats.heartCount || 0, videos: stats.videoCount || 0 }
            };

            return res.json(removeKeysRecursive({ status: true, creator: 'Mayza', input: { action, username: extractedUsername }, result }, ['creator', 'Creator', 'author', 'Author']));
        }

        if (action === 'videos') {
            const response = await axios.post(`${BASE_URL}/profile/videos`, { profile: extractedUsername }, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Origin': 'https://tikviewr.com', 'Referer': 'https://tikviewr.com/', 'User-Agent': randomUA() },
                timeout: 30000
            });

            const videos = (response.data?.data?.data?.videos || []).map(v => ({
                id: v.video_id, title: v.title, duration: v.duration, cover: v.cover,
                play_url: v.play, wmplay_url: v.wmplay,
                music: { title: v.music_info?.title, author: v.music_info?.author, url: v.music_info?.play },
                stats: { views: v.play_count || 0, likes: v.digg_count || 0, comments: v.comment_count || 0, shares: v.share_count || 0 },
                author: { id: v.author?.id, username: v.author?.unique_id, nickname: v.author?.nickname }
            }));

            return res.json(removeKeysRecursive({ status: true, creator: 'Mayza', input: { action, username: extractedUsername }, result: { total: videos.length, videos } }, ['creator', 'Creator', 'author', 'Author']));
        }

        res.json(removeKeysRecursive({ status: false, creator: 'Mayza', result: { msg: `Action '${action}' tidak dikenal. Gunakan 'profile' atau 'videos'.` } }, ['creator', 'Creator', 'author', 'Author']));

    } catch (error) {
        res.json(removeKeysRecursive({ status: false, creator: 'Mayza', message: error.message }, ['creator', 'Creator', 'author', 'Author']));
    }
};

module.exports = { tiktok };