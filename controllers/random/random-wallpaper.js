const axios = require('axios');

const images = [
    "https://i.pinimg.com/564x/3b/51/0b/3b510b9dc9ce95e068ebfb66cee8fcfb.jpg",
    "https://i.pinimg.com/originals/8b/f4/fa/8bf4fa5c4d4c00e52b9386da6d5e6723.jpg",
    "https://i.pinimg.com/originals/ce/00/24/ce002453879ef6c5eda3db249946d372.jpg",
    "https://i.pinimg.com/originals/47/76/b0/4776b0068a7de7e691a2f7b479818a9b.jpg"
];

const randomWallpaper = async (req, res) => {
    try {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const response = await axios.get(randomImage, { responseType: 'arraybuffer', timeout: 15000 });
        res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
        res.set('X-Creator', 'Mayza');
        res.send(response.data);
    } catch (error) {
        res.redirect(302, images[Math.floor(Math.random() * images.length)]);
    }
};

module.exports = { randomWallpaper };