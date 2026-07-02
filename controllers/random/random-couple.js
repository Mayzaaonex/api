const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

const pairs = [
    { cewe: "https://files.catbox.moe/covxzy.jpg", cowo: "https://files.catbox.moe/onqo1a.jpg" },
    { cewe: "https://files.catbox.moe/xq8of0.jpg", cowo: "https://files.catbox.moe/50myst.jpg" },
    { cewe: "https://files.catbox.moe/m57z6w.jpg", cowo: "https://files.catbox.moe/bbfrg8.jpg" },
    { cewe: "https://files.catbox.moe/upfa24.jpg", cowo: "https://files.catbox.moe/fg18ob.jpg" }
];

const randomCouple = async (req, res) => {
    try {
        const pair = pairs[Math.floor(Math.random() * pairs.length)];

        const [ceweRes, cowoRes] = await Promise.all([
            axios.get(pair.cewe, { responseType: 'arraybuffer', timeout: 15000 }),
            axios.get(pair.cowo, { responseType: 'arraybuffer', timeout: 15000 })
        ]);

        const ceweImg = await loadImage(ceweRes.data);
        const cowoImg = await loadImage(cowoRes.data);

        const maxH = Math.max(ceweImg.height, cowoImg.height);
        const totalW = ceweImg.width + cowoImg.width;

        const canvas = createCanvas(totalW, maxH);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(cowoImg, 0, 0, cowoImg.width, maxH);
        ctx.drawImage(ceweImg, cowoImg.width, 0, ceweImg.width, maxH);

        res.set('Content-Type', 'image/png');
        res.set('X-Creator', 'Mayza');
        canvas.createPNGStream().pipe(res);

    } catch (error) {
        res.json({ creator: 'Mayza', status: true, result: pairs[Math.floor(Math.random() * pairs.length)] });
    }
};

module.exports = { randomCouple };