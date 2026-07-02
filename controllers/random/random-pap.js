const axios = require('axios');
const path = require('path');
const fs = require('fs');
const os = require('os');
const credit = { creator: 'Mayza' };

const images = [
    'https://i.pinimg.com/originals/6a/74/83/6a74838448f8b1238c69c8e3787f4e1b.jpg',
    'https://i.pinimg.com/originals/56/d1/93/56d1933c5344abe70dd9547e2266f929.jpg',
    'https://i.pinimg.com/originals/ac/47/7e/ac477e7923915d16545a37be76a3ef2f.jpg'
];

const indexFile = path.join(os.tmpdir(), 'pap_index.txt');

const randomPap = async (req, res) => {
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

module.exports = { randomPap };