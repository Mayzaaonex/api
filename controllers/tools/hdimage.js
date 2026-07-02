const axios = require('axios');
const crypto = require('crypto');
const credit = { creator: 'Mayza' };

const sanitizeError = (error) => {
    const msg = error.message || '';
    if (msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT')) return 'Failed to connect to target';
    if (msg.includes(' certificate') || msg.includes('SSL')) return 'SSL error';
    return 'Internal error';
};

const hdimage = async (req, res) => {
    try {
        const quality = req.query?.quality || req.body?.quality || '4k';
        if (!req.files?.file) return res.json({ creator: 'Mayza', status: false, message: 'File wajib diupload' });

        const file = req.files.file;
        if (!file.mimetype.startsWith('image/')) {
            return res.json({ creator: 'Mayza', status: false, message: 'Hanya file gambar yang diizinkan' });
        }

        const BASE = 'https://sparkpix.ai';
        const UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36';
        const scale = quality === '8k' ? 4 : (quality === '6k' ? 3 : 2);

        // Get upload URL
        const uploadRes = await axios.post(BASE + '/api/upload-url', {
            contentType: file.mimetype, size: file.size, fileName: file.name
        }, { headers: { 'Content-Type': 'application/json', 'User-Agent': UA, 'Origin': BASE }, timeout: 30000 });

        if (!uploadRes.data?.success) throw new Error('Gagal upload URL');

        // Upload file
        await axios.put(uploadRes.data.uploadUrl, file.data, {
            headers: { 'Content-Type': file.mimetype, 'Content-Length': file.size },
            timeout: 60000
        });

        // Upscale
        const resultRes = await axios.post(BASE + '/api/free-hd-upscale', {
            imageUrl: uploadRes.data.publicUrl, scale, face_enhance: false
        }, { headers: { 'Content-Type': 'application/json', 'User-Agent': UA, 'Origin': BASE }, timeout: 30000 });

        if (!resultRes.data?.success) throw new Error('Upscale gagal');

        const imgRes = await axios.get(resultRes.data.resultUrl, { responseType: 'arraybuffer', timeout: 60000 });
        res.set('Content-Type', 'image/png');
        res.set('X-Creator', 'Mayza');
        res.send(imgRes.data);

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, message: sanitizeError(error) });
    }
};

module.exports = { hdimage };