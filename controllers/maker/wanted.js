const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const os = require('os');
const fs = require('fs');
const credit = { creator: 'Mayza' };

const wanted = async (req, res) => {
    try {
        const nama = (req.query.nama || 'Jokowi Dodo').toUpperCase().trim();
        const harga = (req.query.harga || '150.000.000').trim();
        const imageUrl = (req.query.url || 'https://www.upload.ee/image/19400325/images.webp').trim();

        const bgUrl = 'https://Mayzacode.my.id/cdn/wanted1.png';
        const dollarUrl = 'https://Mayzacode.my.id/cdn/Dollar.png';
        const fontNamaUrl = 'https://Mayzacode.my.id/cdn/PlayfairDisplay-Bold.ttf';
        const fontHargaUrl = 'https://api-nanas.my.id/Ryu-Japanese.ttf';

        const bgImg = await loadImage(bgUrl);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        // Foto
        try {
            const photo = await loadImage(imageUrl);
            ctx.drawImage(photo, 74, 253, 635, 475);
        } catch (e) {}

        // Fonts
        const namaFontRes = await axios.get(fontNamaUrl, { responseType: 'arraybuffer' });
        const namaFontPath = path.join(os.tmpdir(), `wanted_${Date.now()}.ttf`);
        fs.writeFileSync(namaFontPath, namaFontRes.data);
        registerFont(namaFontPath, { family: 'WantedName' });

        const hargaFontRes = await axios.get(fontHargaUrl, { responseType: 'arraybuffer' });
        const hargaFontPath = path.join(os.tmpdir(), `wanted_harga_${Date.now()}.ttf`);
        fs.writeFileSync(hargaFontPath, hargaFontRes.data);
        registerFont(hargaFontPath, { family: 'WantedHarga' });

        ctx.fillStyle = 'rgb(60, 30, 10)';
        ctx.textAlign = 'center';

        // Nama
        ctx.font = '70px WantedName';
        ctx.fillText(nama, 381, 920);

        // Dollar + Harga
        try {
            const dollarImg = await loadImage(dollarUrl);
            ctx.drawImage(dollarImg, 240, 975, 51, 77);
        } catch (e) {}
        ctx.font = '70px WantedHarga';
        ctx.fillText(harga, 400, 1030);

        fs.unlinkSync(namaFontPath);
        fs.unlinkSync(hargaFontPath);
        res.set('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);

    } catch (error) {
        res.json({ status: false, creator: 'Mayza', message: error.message });
    }
};

module.exports = { wanted };
