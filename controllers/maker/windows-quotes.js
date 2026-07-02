const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const windowsQuotes = async (req, res) => {
    try {
        const text = (req.query.text || 'kenapa nyahh aku salah mulu').trim();

        const bgUrl = 'https://Mayzacode.my.id/cdn/windows.jpg';
        const fontUrl = 'https://Mayzacode.my.id/cdn/Arial-bold.ttf';

        const bgImg = await loadImage(bgUrl);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        const fontRes = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        const fontPath = path.join(os.tmpdir(), `windows_${Date.now()}.ttf`);
        fs.writeFileSync(fontPath, fontRes.data);
        registerFont(fontPath, { family: 'ArialBold' });

        const FRAME_X1 = 99, FRAME_Y1 = 428, FRAME_X2 = 486, FRAME_Y2 = 995;
        const frameW = FRAME_X2 - FRAME_X1 - 20;
        const frameH = FRAME_Y2 - FRAME_Y1;

        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';

        let fontSize = 76;
        const words = text.split(' ');

        while (fontSize >= 14) {
            ctx.font = `${fontSize}px ArialBold`;
            if (words.length * fontSize * 1.4 <= frameH) break;
            fontSize -= 2;
        }

        ctx.font = `${fontSize}px ArialBold`;
        const lh = fontSize * 1.4;
        const startY = FRAME_Y1 + (frameH - words.length * lh) / 2 + fontSize;

        words.forEach((word, i) => {
            ctx.fillText(word, FRAME_X1 + 10, startY + i * lh);
        });

        fs.unlinkSync(fontPath);
        res.set('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { windowsQuotes };
