const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const credit = { creator: 'Mayza' };

const nasaLandsat = async (req, res) => {
    try {
        let name = (req.query.name || 'NASA').toLowerCase().replace(/[^a-z]/g, '');
        if (!name) return res.json({ ...credit, status: false, message: 'Parameter name diperlukan (huruf A-Z)' });

        const BASE_URL = 'https://science.nasa.gov/specials/your-name-in-landsat/images';
        const UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36';

        const letters = [];
        let totalWidth = 0;
        const letterW = 250, letterH = 600, gap = 10;

        for (const char of name) {
            try {
                const res = await axios.get(`${BASE_URL}/${char}_0.jpg`, {
                    responseType: 'arraybuffer',
                    headers: { 'User-Agent': UA, 'Referer': 'https://science.nasa.gov/specials/your-name-in-landsat/', 'Accept': 'image/*' },
                    timeout: 15000
                });
                const img = await loadImage(res.data);
                letters.push(img);
                totalWidth += letterW + gap;
            } catch (e) {
                return res.json({ ...credit, status: false, message: `Gagal download huruf: ${char}` });
            }
        }

        totalWidth -= gap;
        const canvas = createCanvas(totalWidth, letterH);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, totalWidth, letterH);

        let x = 0;
        letters.forEach(img => {
            ctx.drawImage(img, x, 0, letterW, letterH);
            x += letterW + gap;
        });

        res.set('Content-Type', 'image/jpeg');
        canvas.createJPEGStream({ quality: 0.95 }).pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { nasaLandsat };