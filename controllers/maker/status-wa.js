const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const statusWa = async (req, res) => {
    try {
        const nama = req.query.nama || 'Mayza';
        const pesan = req.query.pesan || 'Halo semua!';
        const profileUrl = req.query.profile || 'https://i.pinimg.com/originals/6a/74/83/6a74838448f8b1238c69c8e3787f4e1b.jpg';

        const bgUrl = 'https://Mayzacode.my.id/Status_wa.jpg';
        const fontUrl = 'https://Mayzacode.my.id/Roboto.ttf';

        const bgImg = await loadImage(bgUrl);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        // Profile
        try {
            const profile = await loadImage(profileUrl);
            const r = 237;
            ctx.save();
            ctx.beginPath();
            ctx.arc(471, 438, r, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(profile, 471 - r, 438 - r, r * 2, r * 2);
            ctx.restore();
        } catch (e) {}

        const fontRes = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        const fontPath = path.join(os.tmpdir(), `roboto_${Date.now()}.ttf`);
        fs.writeFileSync(fontPath, fontRes.data);
        registerFont(fontPath, { family: 'Roboto' });

        // Nama
        ctx.font = '65px Roboto';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.fillText(nama, 184, 1205);

        // Pesan
        ctx.font = '65px Roboto';
        ctx.fillStyle = 'rgb(180, 180, 180)';
        ctx.textAlign = 'center';
        const words = pesan.split(' ');
        let lines = [], line = '';
        words.forEach(w => {
            const t = line ? line + ' ' + w : w;
            if (ctx.measureText(t).width > 676 && line) { lines.push(line); line = w; }
            else line = t;
        });
        if (line) lines.push(line);
        lines.forEach((l, i) => ctx.fillText(l, 533, 900 + i * 91));

        fs.unlinkSync(fontPath);
        res.set('Content-Type', 'image/jpeg');
        canvas.createJPEGStream({ quality: 0.95 }).pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { statusWa };
