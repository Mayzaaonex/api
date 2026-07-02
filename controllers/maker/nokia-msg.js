const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const nokiaMsg = async (req, res) => {
    try {
        const sender = req.query.sender || 'Mayza';
        const pesan = req.query.pesan || 'Halo bro!';

        const bgUrl = 'https://Mayzacode.my.id/nokia.jpg';
        const fontUrl = 'https://Mayzacode.my.id/PixelifySans.ttf';

        const bgImg = await loadImage(bgUrl);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        const fontRes = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        const fontPath = path.join(os.tmpdir(), `pixelify_${Date.now()}.ttf`);
        fs.writeFileSync(fontPath, fontRes.data);
        registerFont(fontPath, { family: 'Pixelify' });

        ctx.fillStyle = 'black';

        // PESAN
        ctx.font = '76px Pixelify';
        ctx.textAlign = 'center';
        const pesanWords = pesan.split(' ');
        let pesanLines = [], line = '';
        pesanWords.forEach(w => {
            const t = line ? line + ' ' + w : w;
            if (ctx.measureText(t).width > 726 && line) { pesanLines.push(line); line = w; }
            else line = t;
        });
        if (line) pesanLines.push(line);
        pesanLines.forEach((l, i) => ctx.fillText(l, 622, 475 + i * 114));

        // SENDER ATAS
        ctx.font = '100px Pixelify';
        ctx.textAlign = 'left';
        ctx.fillText(sender, 338, 370);

        // SENDER BAWAH
        ctx.font = '36px Pixelify';
        ctx.textAlign = 'left';
        ctx.fillText(sender, 878, 836);

        fs.unlinkSync(fontPath);
        res.set('Content-Type', 'image/jpeg');
        canvas.createJPEGStream().pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { nokiaMsg };
