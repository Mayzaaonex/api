const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const smeme = async (req, res) => {
    try {
        const top = (req.query.atas || 'FOR').toUpperCase().trim();
        const bottom = (req.query.bawah || 'YOU').toUpperCase().trim();
        const imageUrl = req.query.url || 'https://raw.githubusercontent.com/SaurusAraAra/mentahan/refs/heads/main/kucing_megang_bunga.jpg';
        const fontUrl = 'https://raw.githubusercontent.com/SaurusAraAra/mentahan/main/font/Impact.ttf';

        const img = await loadImage(imageUrl);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const fontRes = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        const fontPath = path.join(os.tmpdir(), `impact_${Date.now()}.ttf`);
        fs.writeFileSync(fontPath, fontRes.data);
        registerFont(fontPath, { family: 'Impact' });

        const padding = Math.round(Math.min(img.width, img.height) * 0.04);
        const maxW = img.width - padding * 2;
        const fontSize = Math.round(Math.min(img.width, img.height) * 0.10);

        ctx.font = `bold ${fontSize}px Impact`;
        ctx.textAlign = 'center';
        ctx.lineWidth = Math.max(2, Math.round(fontSize * 0.08));

        if (top) {
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'white';
            ctx.strokeText(top, img.width / 2, padding + fontSize);
            ctx.fillText(top, img.width / 2, padding + fontSize);
        }

        if (bottom) {
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'white';
            ctx.strokeText(bottom, img.width / 2, img.height - padding);
            ctx.fillText(bottom, img.width / 2, img.height - padding);
        }

        fs.unlinkSync(fontPath);
        res.set('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, message: error.message });
    }
};

module.exports = { smeme };