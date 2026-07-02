const axios = require('axios');
const { createCanvas, loadImage, Image } = require('canvas');
const credit = { creator: 'Mayza' };

const topixel = async (req, res) => {
    try {
        let imageUrl = req.query?.url || '';
        const pixelLevel = parseInt(req.query?.level || req.body?.level || '30');
        const block = Math.min(Math.max(41 - Math.min(Math.max(pixelLevel, 1), 40), 1), 40);
        const hasFile = !!req.files?.file;

        if (!imageUrl && !hasFile) throw new Error('Upload file atau masukkan URL');

        if (hasFile) {
            // Convert file ke base64 data URL
            const file = req.files.file;
            const base64 = file.data.toString('base64');
            imageUrl = `data:${file.mimetype};base64,${base64}`;
        }

        const img = await loadImage(imageUrl);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        for (let y = 0; y < img.height; y += block) {
            for (let x = 0; x < img.width; x += block) {
                let r = 0, g = 0, b = 0, a = 0, count = 0;
                const maxY = Math.min(y + block, img.height);
                const maxX = Math.min(x + block, img.width);

                for (let yy = y; yy < maxY; yy++) {
                    for (let xx = x; xx < maxX; xx++) {
                        const idx = (yy * img.width + xx) * 4;
                        r += data[idx];
                        g += data[idx + 1];
                        b += data[idx + 2];
                        a += data[idx + 3];
                        count++;
                    }
                }

                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);
                a = Math.round(a / count);

                for (let yy = y; yy < maxY; yy++) {
                    for (let xx = x; xx < maxX; xx++) {
                        const idx = (yy * img.width + xx) * 4;
                        data[idx] = r;
                        data[idx + 1] = g;
                        data[idx + 2] = b;
                        data[idx + 3] = a;
                    }
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        res.set('Content-Type', 'image/png');
        res.set('X-Creator', 'Mayza');
        canvas.createPNGStream({ compressionLevel: 9 }).pipe(res);

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, error: error.message });
    }
};

module.exports = { topixel };