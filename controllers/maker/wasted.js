const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const credit = { creator: 'Mayza' };

const wasted = async (req, res) => {
    try {
        const imageUrl = req.query.url || '';
        if (!imageUrl) return res.json({ ...credit, status: false, message: 'Parameter url diperlukan' });

        const img = await loadImage(imageUrl);
        const wastedImg = await loadImage('https://www.gobox.my.id/file/0bsEg.jpg');

        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        // Grayscale
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);

        const targetW = Math.floor(img.width * 0.8);
        const targetH = Math.floor(wastedImg.height * (targetW / wastedImg.width));
        const x = Math.floor((img.width - targetW) / 2);
        const y = Math.floor((img.height - targetH) / 2);
        ctx.drawImage(wastedImg, x, y, targetW, targetH);

        res.set('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { wasted };