const axios = require('axios');
const credit = { creator: 'Mayza' };
const BASE = 'https://copier.saveweb2zip.com';
const UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36';

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

const web2zip = async (req, res) => {
    try {
        const url = req.query.url || '';
        if (!url || !url.match(/^https?:\/\//)) return res.json({ ...credit, status: false, message: 'Parameter url wajib diisi (URL valid)' });

        if (!isValidUrl(url)) {
            return res.json({ ...credit, status: false, message: 'URL tidak valid atau tidak diizinkan' });
        }

        // Start copy
        const copyRes = await axios.post(BASE + '/api/copySite', {
            url, renameAssets: false, saveStructure: true, alternativeAlgorithm: true, mobileVersion: true
        }, { headers: { 'Content-Type': 'application/json', 'User-Agent': UA }, timeout: 30000 });

        if (!copyRes.data?.md5) throw new Error('Gagal memulai copy');

        const hash = copyRes.data.md5;
        let result = null;

        for (let i = 0; i < 120; i++) {
            await new Promise(r => setTimeout(r, 2000));
            const statusRes = await axios.get(BASE + '/api/getStatus/' + hash, { headers: { 'User-Agent': UA }, timeout: 15000 });

            if (statusRes.data?.isFinished) {
                result = {
                    status: statusRes.data.success || false,
                    md5: hash,
                    copied_files: statusRes.data.copiedFilesAmount || 0,
                    download_url: BASE + '/api/downloadArchive/' + hash
                };
                break;
            }
        }

        if (!result) throw new Error('Timeout');

        res.json({ ...credit, status: true, result });

    } catch (error) {
        res.json({ ...credit, status: false, message: sanitizeError(error) });
    }
};

module.exports = { web2zip };