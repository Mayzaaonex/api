const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');
const credit = { creator: 'Mayza' };

const BASE = 'https://filego.at';
const S3_BASE = 'https://filegoat.s3.de.io.cloud.ovh.net';

const filegoat = async (req, res) => {
    try {
        if (!req.files?.file) return res.json({ ...credit, status: false, message: 'File wajib diupload' });

        const file = req.files.file;
        const form = new FormData();
        form.append('file', file.data, { filename: file.name, contentType: file.mimetype });

        const uploadRes = await axios.post(BASE + '/api/file/upload', form, {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'Origin': BASE, 'Referer': BASE + '/', 'Accept': 'application/json, text/plain, */*'
            },
            timeout: 60000
        });

        const fileIds = uploadRes.data?.fileIds || uploadRes.data?.ids || [uploadRes.data?.id].filter(Boolean);
        if (!fileIds.length) return res.json({ ...credit, status: false, message: 'Upload gagal' });

        const clientId = crypto.randomBytes(16).toString('hex');
        const bucketRes = await axios.post(BASE + '/api/bucket', {
            fileIds: Array.from(new Set(fileIds)), deleteTime: 7, extendOnView: false, clientId
        }, {
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36', 'Origin': BASE, 'Accept': '*/*' },
            timeout: 30000
        });

        if (!bucketRes.data?.slug) return res.json({ ...credit, status: false, message: 'Bucket gagal' });

        const slug = bucketRes.data.slug;

        const detailRes = await axios.get(BASE + '/api/bucket/' + slug, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
            timeout: 30000
        });

        const files = (detailRes.data?.files || []).map(f => ({
            name: f.fileName || f.file_name || '',
            size: f.bytes || 0,
            direct: `${S3_BASE}/${f.savedName || f.saved_name}/${f.fileName || f.file_name}`,
            download: `${S3_BASE}/${f.savedName || f.saved_name}/${f.fileName || f.file_name}?download=true`
        }));

        res.json({ ...credit, status: true, slug, url: BASE + '/bucket/' + slug, expires: bucketRes.data.delete_time || null, files });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { filegoat };