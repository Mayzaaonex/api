const axios = require('axios');
const FormData = require('form-data');
const credit = { creator: 'Mayza' };

const uguu = async (req, res) => {
    try {
        if (!req.files?.file) return res.json({ ...credit, status: false, message: 'File wajib diupload (POST multipart/form-data)' });

        const file = req.files.file;
        const form = new FormData();
        form.append('files[]', file.data, { filename: file.name, contentType: 'application/octet-stream' });

        const response = await axios.post('https://uguu.se/upload.php', form, {
            headers: {
                ...form.getHeaders(),
                'Origin': 'https://uguu.se',
                'Referer': 'https://uguu.se/',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
            },
            timeout: 120000
        });

        const result = response.data;
        const url = result?.files?.[0]?.url || null;
        const success = response.status === 200 && result?.success && url;

        res.json({ ...credit, status: success, code: response.status, input: file.name, url, message: success ? 'Upload berhasil' : 'Upload gagal' });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { uguu };