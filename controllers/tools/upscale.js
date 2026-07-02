const axios = require('axios');
const crypto = require('crypto');
const credit = { creator: 'Mayza' };

const sanitizeError = (error) => {
    const msg = error.message || '';
    if (msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT')) return 'Failed to connect to target';
    if (msg.includes(' certificate') || msg.includes('SSL')) return 'SSL error';
    return 'Internal error';
};

const SIGN_API = 'https://cloudinary-tools.netlify.app/.netlify/functions/sign-upload-params';
const UPLOAD_API = 'https://api.cloudinary.com/v1_1/dtz0urit6/auto/upload';
const API_KEY = '985946268373735';
const UPLOAD_PRESET = 'cloudinary-tools';
const SOURCE = 'ml';
const UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36';

const upscale = async (req, res) => {
    try {
        if (!req.files?.file) return res.json({ ...credit, status: false, message: 'File wajib diupload' });

        const file = req.files.file;
        if (!file.mimetype.startsWith('image/')) {
            return res.json({ ...credit, status: false, message: 'Hanya file gambar yang diizinkan' });
        }

        const timestamp = Math.floor(Date.now() / 1000);

        // Get signature
        const signRes = await axios.post(SIGN_API, {
            paramsToSign: { timestamp, upload_preset: UPLOAD_PRESET, source: SOURCE }
        }, { headers: { 'Content-Type': 'application/json', 'User-Agent': UA }, timeout: 30000 });

        const signature = signRes.data?.signature || '';
        if (!signature) throw new Error('Gagal ambil signature');

        // Upload ke Cloudinary
        const FormData = require('form-data');
        const form = new FormData();
        form.append('upload_preset', UPLOAD_PRESET);
        form.append('source', SOURCE);
        form.append('signature', signature);
        form.append('timestamp', timestamp);
        form.append('api_key', API_KEY);
        form.append('file', file.data, { filename: file.name, contentType: file.mimetype });

        const uploadRes = await axios.post(UPLOAD_API, form, {
            headers: { ...form.getHeaders(), 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest' },
            timeout: 60000
        });

        const resultUrl = uploadRes.data?.secure_url || uploadRes.data?.url || '';
        if (!resultUrl) throw new Error('Upload gagal');

        res.json({ ...credit, status: true, result: { url: resultUrl, filename: file.name } });

    } catch (error) {
        res.json({ ...credit, status: false, message: sanitizeError(error) });
    }
};

module.exports = { upscale };