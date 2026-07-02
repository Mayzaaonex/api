const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const sertifikatNasa = async (req, res) => {
    try {
        const nama = (req.query.nama || '').trim();
        if (!nama) return res.json({ ...credit, status: false, message: 'Parameter nama diperlukan' });

        const bgUrl = 'https://Mayzacode.my.id/nasa.png';
        const fontUrl = 'https://Mayzacode.my.id/CormorantGaramond-SemiBold.ttf';

        const bgImg = await loadImage(bgUrl);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        const fontRes = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        const fontPath = path.join(os.tmpdir(), `nasa_${Date.now()}.ttf`);
        fs.writeFileSync(fontPath, fontRes.data);
        registerFont(fontPath, { family: 'NasaFont' });

        const left = 36, top = 557, right = 984, bottom = 692;
        const boxW = right - left, boxH = bottom - top;

        let fontSize = 82;
        ctx.textAlign = 'center';
        while (fontSize > 20) {
            ctx.font = `${fontSize}px NasaFont`;
            if (ctx.measureText(nama).width <= boxW - 40) break;
            fontSize--;
        }

        ctx.font = `${fontSize}px NasaFont`;
        const x = left + boxW / 2;
        const y = top + boxH / 2 + fontSize / 3 + 12;

        // Shadow
        ctx.fillStyle = 'rgb(55, 30, 8)';
        ctx.fillText(nama, x + 3, y + 3);
        // Depth
        ctx.fillStyle = 'rgb(120, 78, 32)';
        ctx.fillText(nama, x, y + 2);
        // Gold
        ctx.fillStyle = 'rgb(183, 136, 73)';
        ctx.fillText(nama, x, y);
        // Highlight
        ctx.fillStyle = 'rgb(215, 170, 100)';
        ctx.fillText(nama, x, y - 1);

        fs.unlinkSync(fontPath);
        res.set('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { sertifikatNasa };
