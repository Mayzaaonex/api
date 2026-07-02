const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const fakeNgl = async (req, res) => {
    try {
        const text = req.query.text || 'Gw tuh sebenarnya ultramen';
        const bgUrl = 'https://www.gobox.my.id/file/jojYN.jpg';
        const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-SemiBold.ttf';

        const bgImg = await loadImage(bgUrl);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        const fontRes = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        const fontPath = path.join(os.tmpdir(), `poppins_${Date.now()}.ttf`);
        fs.writeFileSync(fontPath, fontRes.data);
        registerFont(fontPath, { family: 'Poppins' });

        const frameX1 = 280, frameY1 = 1032, frameX2 = 2271, frameY2 = 1754;
        const areaW = frameX2 - frameX1 - 60;
        const areaH = frameY2 - frameY1 - 60;

        let fontSize = 100;
        ctx.fillStyle = 'black';

        while (fontSize >= 37) {
            ctx.font = `${fontSize}px Poppins`;
            const words = text.split(' ');
            const lines = [];
            let line = '';
            words.forEach(word => {
                const test = line ? `${line} ${word}` : word;
                if (ctx.measureText(test).width > areaW && line) {
                    lines.push(line);
                    line = word;
                } else line = test;
            });
            if (line) lines.push(line);
            if (lines.length * fontSize * 1.25 <= areaH) break;
            fontSize--;
        }

        ctx.font = `${fontSize}px Poppins`;
        const words = text.split(' ');
        const lines = [];
        let line = '';
        words.forEach(word => {
            const test = line ? `${line} ${word}` : word;
            if (ctx.measureText(test).width > areaW && line) {
                lines.push(line);
                line = word;
            } else line = test;
        });
        if (line) lines.push(line);

        const lh = fontSize * 1.25;
        const startY = frameY1 + (areaH - lines.length * lh) / 2 + lh / 2 + 50;
        lines.forEach((l, i) => {
            ctx.fillText(l, frameX1 + areaW / 2 - ctx.measureText(l).width / 2, startY + i * lh);
        });

        fs.unlinkSync(fontPath);
        res.set('Content-Type', 'image/jpeg');
        canvas.createJPEGStream({ quality: 0.95 }).pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { fakeNgl };