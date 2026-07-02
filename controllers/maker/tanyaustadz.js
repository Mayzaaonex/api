const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const tanyaUstadz = async (req, res) => {
    try {
        const text = (req.query.text || 'halo').trim();

        const bgUrl = 'https://Mayzacode.my.id/tanyaustadz.jpg';
        const fontUrl = 'https://Mayzacode.my.id/Roboto.ttf';

        const bgImg = await loadImage(bgUrl);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        const fontRes = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        const fontPath = path.join(os.tmpdir(), `ustadz_${Date.now()}.ttf`);
        fs.writeFileSync(fontPath, fontRes.data);
        registerFont(fontPath, { family: 'Roboto' });

        const areaW = 873 - 115 - 20;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        let fontSize = 50;
        ctx.font = `${fontSize}px Roboto`;
        const words = text.split(' ');
        let lines = [], line = '';
        words.forEach(w => {
            const t = line ? line + ' ' + w : w;
            if (ctx.measureText(t).width > areaW && line) { lines.push(line); line = w; }
            else line = t;
        });
        if (line) lines.push(line);

        lines.forEach((l, i) => ctx.fillText(l, 494, 430 + i * (fontSize + 12)));

        fs.unlinkSync(fontPath);
        res.set('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { tanyaUstadz };
