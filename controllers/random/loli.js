const axios = require('axios');
const path = require('path');
const fs = require('fs');
const os = require('os');
const credit = { creator: 'Mayza' };

const images = [
    'https://i.pinimg.com/originals/04/82/f4/0482f447e372b130624d4e986f49a39e.jpg',
    'https://i.pinimg.com/originals/a0/80/a9/a080a9465decb49baedfa16ba977f6c0.jpg',
    'https://i.pinimg.com/originals/c4/84/42/c48442dcecc860ccd59490f87dc88f5a.jpg',
    'https://i.pinimg.com/originals/f6/8c/da/f68cda2164869e94365e2712f79ab5e8.png',
    'https://i.pinimg.com/originals/f5/6a/87/f56a87d1d56b3e44233eae545a5f8651.png'
];

const indexFile = path.join(os.tmpdir(), 'loli_index.txt');

const loli = async (req, res) => {
    try {
        let index = 0;
        if (fs.existsSync(indexFile)) {
            index = parseInt(fs.readFileSync(indexFile, 'utf8')) || 0;
            index++;
            if (index >= images.length) index = 0;
        }
        fs.writeFileSync(indexFile, String(index));

        const response = await axios.get(images[index], { responseType: 'arraybuffer', timeout: 30000, headers: { 'User-Agent': 'Mozilla/5.0' } });
        res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
        res.set('Cache-Control', 'no-cache');
        res.send(response.data);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { loli };