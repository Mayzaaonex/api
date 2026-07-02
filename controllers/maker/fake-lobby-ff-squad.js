const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const fakeLobbyFfSquad = async (req, res) => {
    try {
        const nama1 = (req.query.nama1 || 'Mayza').trim();
        const nama2 = (req.query.nama2 || 'Azzam').trim();
        const nama3 = (req.query.nama3 || 'Rizky').trim();
        const nama4 = (req.query.nama4 || 'Budi').trim();

        const bgUrl = 'https://Mayzacode.my.id/squad.jpg';
        const fontUrl = 'https://Mayzacode.my.id/CormorantGaramond-SemiBold.ttf';

        const bgImg = await loadImage(bgUrl);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        const fontRes = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        const fontPath = path.join(os.tmpdir(), `squad_${Date.now()}.ttf`);
        fs.writeFileSync(fontPath, fontRes.data);
        registerFont(fontPath, { family: 'SquadFont' });

        ctx.font = '14px SquadFont';
        ctx.fillStyle = 'rgb(230, 190, 115)';
        ctx.textAlign = 'left';

        // Nama 2
        ctx.fillText(nama2, 140, 309);
        // Nama 1
        ctx.fillText(nama1, 290, 341);
        // Nama 3
        ctx.fillText(nama3, 434, 310);
        // Nama 4
        ctx.fillStyle = 'white';
        ctx.fillText(nama4, 571, 269);

        fs.unlinkSync(fontPath);
        res.set('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { fakeLobbyFfSquad };
