const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const fakeOvo = async (req, res) => {
    try {
        const amountInput = req.query.text || req.query.amount || req.query.query || req.query.q || '';
        if (!amountInput) return res.json({ ...credit, status: false, message: 'Parameter text diperlukan' });

        const digits = amountInput.replace(/[^\d]/g, '') || '0';
        const numeric = Math.min(parseInt(digits) || 0, 10000000);
        const formatted = parseInt(numeric).toLocaleString('id-ID');

        const imageUrl = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Image/file_0000000078bc71fa87da5cf26dc6c008.jpeg';
        const fontUrl = 'https://raw.githubusercontent.com/SaurusAraAra/mentahan/main/font/Poppins.ttf';

        const bgImg = await loadImage(imageUrl);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        const fontRes = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        const fontPath = path.join(os.tmpdir(), `ovo_${Date.now()}.ttf`);
        fs.writeFileSync(fontPath, fontRes.data);
        registerFont(fontPath, { family: 'Poppins' });

        ctx.fillStyle = 'white';
        ctx.font = '20px Poppins';
        ctx.fillText('Rp', 61, 368);
        ctx.font = '28px Poppins';
        ctx.fillText(formatted, 94, 371);

        fs.unlinkSync(fontPath);
        res.set('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { fakeOvo };