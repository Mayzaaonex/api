const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const fakeDana = async (req, res) => {
    try {
        const angka = req.query.text || '150000';
        const raw = parseInt(angka.replace(/[^\d]/g, '')) || 0;
        const formatted = raw.toLocaleString('id-ID');

        const bgUrl = 'https://Mayzacode.my.id/cdn/dana.jpg';
        const fontUrl = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/f5803c-1772975107907.ttf';
        const eyeIconUrl = 'https://Mayzacode.my.id/cdn/eye.png';

        const bgImg = await loadImage(bgUrl);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        const fontRes = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        const fontPath = path.join(os.tmpdir(), `dana_${Date.now()}.ttf`);
        fs.writeFileSync(fontPath, fontRes.data);
        registerFont(fontPath, { family: 'DanaFont' });

        const textX1 = 184, textY1 = 67, textY2 = 114;
        const textCenterY = (textY1 + textY2) / 2;

        ctx.font = '40px DanaFont';
        ctx.fillStyle = 'white';
        const textW = ctx.measureText(formatted).width;
        ctx.fillText(formatted, textX1, textCenterY + 20);

        try {
            const eyeImg = await loadImage(eyeIconUrl);
            ctx.drawImage(eyeImg, textX1 + textW + 5, 70, 39, 34);
        } catch (e) {}

        fs.unlinkSync(fontPath);
        res.set('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { fakeDana };
