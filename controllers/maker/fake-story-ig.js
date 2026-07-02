const axios = require('axios');
const FormData = require('form-data');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const fs = require('fs');

const fakeStoryIg = async (req, res) => {
    try {
        const name = req.body?.name || req.query?.name || 'User';
        const text = req.body?.text || req.query?.text || '';
        if (!text) return res.json({ creator: 'Mayza', status: false, message: 'Parameter text wajib diisi' });

        let ppUrl = 'https://raw.githubusercontent.com/uploader762/dat4/main/uploads/e0f993-1777126212302.jpg';
        if (req.files?.file) {
            const file = req.files.file;
            const form = new FormData();
            form.append('file', file.data, file.name);
            const uploadRes = await axios.post('https://www.gobox.my.id/upload', form, {
                headers: form.getHeaders(),
                timeout: 30000
            });
            ppUrl = uploadRes.data?.url || uploadRes.data?.data?.url || ppUrl;
        }

        // Font downloads
        const font1 = await axios.get('https://raw.githubusercontent.com/uploader762/dat2/main/uploads/957068-1777109622178.ttf', { responseType: 'arraybuffer' });
        const font2 = await axios.get('https://raw.githubusercontent.com/uploader762/dat1/main/uploads/5206ca-1777112931358.otf', { responseType: 'arraybuffer' });
        const bgRes = await axios.get('https://raw.githubusercontent.com/uploader762/dat4/main/uploads/036484-1777108103055.jpg', { responseType: 'arraybuffer' });
        const ppRes = await axios.get(ppUrl, { responseType: 'arraybuffer' });

        const font1Path = path.join(__dirname, '../../font/Nuninto-SemiBold.ttf');
        const font2Path = path.join(__dirname, '../../font/Cooper-black.ttf');
        fs.mkdirSync(path.dirname(font1Path), { recursive: true });
        fs.writeFileSync(font1Path, font1.data);
        fs.writeFileSync(font2Path, font2.data);
        registerFont(font1Path, { family: 'Nuninto' });
        registerFont(font2Path, { family: 'Cooper' });

        const bgImg = await loadImage(bgRes.data);
        const ppImg = await loadImage(ppRes.data);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0);

        // Circle PP
        const r = 93;
        ctx.save();
        ctx.beginPath();
        ctx.arc(126 + r, 239 + r, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(ppImg, 126, 239, r * 2, r * 2);
        ctx.restore();

        // Name
        ctx.font = '48px Nuninto';
        ctx.fillStyle = 'white';
        ctx.fillText(name, 316, 360);

        // Text
        ctx.font = '74px Cooper';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        const words = text.split(' ');
        let lines = [], line = '';
        words.forEach(w => {
            const t = line ? line + ' ' + w : w;
            if (ctx.measureText(t).width > 1076 && line) { lines.push(line); line = w; }
            else line = t;
        });
        if (line) lines.push(line);
        lines.forEach((l, i) => ctx.fillText(l, 658, 600 + i * 81));

        res.set('Content-Type', 'image/png');
        res.set('X-Creator', 'Mayza');
        canvas.createPNGStream().pipe(res);

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, message: error.message });
    }
};

module.exports = { fakeStoryIg };