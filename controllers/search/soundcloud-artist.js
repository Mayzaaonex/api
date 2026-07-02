const axios = require('axios');
const credit = { creator: 'Mayza' };
const CLIENT_ID = 'KKzJxmw11tYpCs6T24P4uUYhqmjalG6M';

const soundcloudArtist = async (req, res) => {
    try {
        const user = req.query.user || '';
        if (!user) return res.json({ ...credit, status: false, message: 'Parameter user wajib diisi' });

        const resolveRes = await axios.get(`https://api-mobi.soundcloud.com/resolve?url=https://soundcloud.com/${user}&client_id=${CLIENT_ID}`, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
            timeout: 30000
        });

        if (!resolveRes.data?.id) return res.json({ ...credit, status: false, message: 'User tidak ditemukan' });

        const userId = resolveRes.data.id;
        const allTracks = [];
        let offset = 0;
        const limit = 50;
        let hasMore = true;

        while (hasMore) {
            const tracksRes = await axios.get(`https://api-mobi.soundcloud.com/users/${userId}/tracks`, {
                params: { limit, offset, client_id: CLIENT_ID },
                headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
                timeout: 30000
            });

            const collection = tracksRes.data?.collection || [];
            if (!collection.length) { hasMore = false; break; }

            collection.forEach(track => {
                allTracks.push({
                    id: track.id || '',
                    title: track.title || '',
                    url: track.permalink_url || '',
                    artwork: track.artwork_url || '',
                    duration: Math.round((track.duration || 0) / 1000 * 10) / 10 + 's',
                    plays: track.playback_count || 0,
                    likes: track.likes_count || 0,
                    genre: track.genre || ''
                });
            });

            offset += limit;
            if (!tracksRes.data?.next_href) hasMore = false;
            await new Promise(r => setTimeout(r, 200));
        }

        res.json({ ...credit, status: true, result: { user, username: resolveRes.data.username, total_tracks: resolveRes.data.track_count || 0, fetched: allTracks.length, tracks: allTracks } });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { soundcloudArtist };