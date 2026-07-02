const axios = require('axios');
const path = require('path');
const fs = require('fs');
const os = require('os');
const credit = { creator: 'Mayza' };

const images = [
    'https://i.pinimg.com/originals/8b/3a/f4/8b3af408098c811395efe70c30228533.jpg',
    'https://i.pinimg.com/originals/e0/d1/71/e0d171bb1c3d5dbb36f73eedf3df59fd.jpg',
    'https://i.pinimg.com/originals/9a/1e/db/9a1edb3a20db9a56dd8c7adc4a32ba6a.jpg',
    'https://i.pinimg.com/originals/0b/81/e3/0b81e32f12bb312e8f9655c9406644b2.jpg',
    'https://i.pinimg.com/originals/c8/f3/53/c8f353254804f2bb021fd65ad94e8331.jpg'
];

const indexFile = path.join(os.tmpdir(), 'meme_index.txt');

const meme = async (req, res) => {
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

module.exports = { meme };