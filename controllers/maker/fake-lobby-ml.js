const axios = require('axios');
const credit = { creator: 'Mayza' };

const fakeLobbyMl = async (req, res) => {
    try {
        const username = req.query.username || 'Player';
        const avatar = req.query.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';
        const rank = req.query.rank || 'imo';
        const border = req.query.border || '0';

        const apiUrl = `https://anabot.my.id/api/maker/ML-fake?username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&rank=${encodeURIComponent(rank)}&border=${encodeURIComponent(border)}&apikey=freeApikey`;

        const response = await axios.get(apiUrl, {
            headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
            timeout: 30000
        });

        const contentType = response.headers['content-type'];
        if (contentType?.includes('image')) {
            res.set('Content-Type', contentType);
            return res.send(response.data);
        }

        const imageUrl = response.data?.url || response.data?.result || response.data?.image;
        if (imageUrl) {
            const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 30000 });
            res.set('Content-Type', 'image/png');
            return res.send(imgRes.data);
        }

        res.json({ ...credit, status: false, message: 'Gagal mendapatkan gambar', raw: response.data });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { fakeLobbyMl };