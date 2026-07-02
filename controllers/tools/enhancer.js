const axios = require('axios');
const FormData = require('form-data');
const credit = { creator: 'Mayza' };

const isValidUrl = (url) => {
    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname.toLowerCase();
        const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (ipPattern.test(hostname)) {
            const octets = hostname.split('.').map(Number);
            if (octets[0] === 169 && octets[1] === 254) return false;
            if (octets[0] === 10 || octets[0] === 127 || octets[0] === 0) return false;
            if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return false;
            if (octets[0] === 192 && octets[1] === 168) return false;
        }
        if (hostname.includes('localhost') || hostname.includes('metadata.google.internal') || hostname.includes('169.254.169.254')) return false;
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch { return false; }
};

const sanitizeError = (error) => {
    const msg = error.message || '';
    if (msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT')) return 'Failed to connect to target';
    if (msg.includes(' certificate') || msg.includes('SSL')) return 'SSL error';
    return 'Internal error';
};

const enhancer = async (req, res) => {
    try {
        let imageUrl = req.query.url || '';
        const hasFile = !!req.files?.file;

        if (!imageUrl && !hasFile) {
            return res.json({ creator: 'Mayza', status: false, message: 'Parameter url atau file wajib diisi' });
        }

        if (imageUrl && !isValidUrl(imageUrl)) {
            return res.json({ creator: 'Mayza', status: false, message: 'URL tidak valid atau tidak diizinkan' });
        }

        if (hasFile) {
            const file = req.files.file;
            if (!file.mimetype.startsWith('image/')) {
                return res.json({ creator: 'Mayza', status: false, message: 'Hanya file gambar yang diizinkan' });
            }
            const form = new FormData();
            form.append('file', file.data, file.name);

            const uploadRes = await axios.post('https://www.gobox.my.id/upload', form, {
                headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
                timeout: 30000
            });
            imageUrl = uploadRes.data?.url || uploadRes.data?.data?.url || '';
            if (!imageUrl) return res.json({ creator: 'Mayza', status: false, message: 'Upload gagal' });
        }

        const response = await axios.get('https://api-varhad.my.id/tools/remini', {
            params: { imageUrl },
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 60000
        });

        res.set('Content-Type', response.headers['content-type'] || 'image/png');
        res.set('X-Creator', 'Mayza');
        res.send(response.data);

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, message: sanitizeError(error) });
    }
};

module.exports = { enhancer };