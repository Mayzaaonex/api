const axios = require('axios');
const path = require('path');
const fs = require('fs');
const os = require('os');
const credit = { creator: 'Mayza' };

const images = [
    'https://i.pinimg.com/originals/66/53/af/6653af2d6a8e3e5ee4a297d96fd1a161.jpg',
    'https://i.pinimg.com/originals/b8/7d/5e/b87d5e0e68042a321c4cba9cff487ff8.jpg',
    'https://i.pinimg.com/originals/67/92/62/6792629be32484fa1988d542f4eaec5a.jpg',
    'https://i.pinimg.com/originals/99/b1/08/99b108d833ce10ff05c708546cb68785.jpg'
];

const indexFile = path.join(os.tmpdir(), 'waifu_index.txt');

const waifu = async (req, res) => {
    try {
        let index = 0;
        if (fs.existsSync(indexFile)) {
            index = parseInt(fs.readFileSync(indexFile, 'utf8')) || 0;
            index++;
            if (index >= images.length) index = 0;
        }
        fs.writeFileSync(indexFile, String(index));

        const response = await axios.get(images[index], { responseType: 'arraybuffer', timeout: 30000 });
        res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
        res.set('Cache-Control', 'no-cache');
        res.send(response.data);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { waifu };