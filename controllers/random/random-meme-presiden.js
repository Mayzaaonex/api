const axios = require('axios');
const path = require('path');
const fs = require('fs');
const os = require('os');
const credit = { creator: 'Mayza' };

const images = [
    'https://i.pinimg.com/originals/c7/b1/18/c7b118f3b04412643f105ec0023ead58.jpg',
    'https://i.pinimg.com/originals/e9/b8/e7/e9b8e7a5952c95ba81e575a44d8eebeb.jpg',
    'https://i.pinimg.com/originals/5e/c0/db/5ec0db037418503e34ae55178fbb5cd2.png'
];

const indexFile = path.join(os.tmpdir(), 'presiden_index.txt');

const randomMemePresiden = async (req, res) => {
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

module.exports = { randomMemePresiden };