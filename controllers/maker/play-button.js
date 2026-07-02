const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const playButton = async (req, res) => {
    try {
        const nama = req.query.nama || 'Mayza';
        const template = req.query.template || 'silver';

        const bgUrl = template === 'gold' ? 'https://Mayzacode.my.id/play-button/gold.jpg' : 'https://Mayzacode.my.id/play-button/silver.jpg';
        const fontUrl = 'https://raw.githubusercontent.com/SaurusAraAra/mentahan/main/font/Poppins.ttf';
        const fontSize = template === 'gold' ? 79 : 60;

        const bgImg = await loadImage(bgUrl);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        const fontRes = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        const fontPath = path.join(os.tmpdir(), `playbtn_${Date.now()}.ttf`);
        fs.writeFileSync(fontPath, fontRes.data);
        registerFont(fontPath, { family: 'Poppins' });

        ctx.font = `${fontSize}px Poppins`;
        ctx.fillStyle = 'rgb(240, 240, 240)';
        ctx.textAlign = 'center';
        ctx.fillText(nama, canvas.width / 2, template === 'gold' ? 1290 : 1099);

        fs.unlinkSync(fontPath);
        res.set('Content-Type', 'image/jpeg');
        canvas.createJPEGStream({ quality: 0.95 }).pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { playButton };
