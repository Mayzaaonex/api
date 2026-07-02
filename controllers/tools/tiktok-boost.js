const axios = require('axios');
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

const tiktokBoost = async (req, res) => {
    try {
        const tiktokUrl = req.query.url || '';
        let targetLikes = parseInt(req.query.target) || 50;
        if (![10, 20, 30, 50, 100].includes(targetLikes)) targetLikes = 50;
        if (!tiktokUrl) return res.json({ ...credit, status: false, message: 'Parameter url wajib diisi' });

        if (!isValidUrl(tiktokUrl)) {
            return res.json({ ...credit, status: false, message: 'URL tidak valid atau tidak diizinkan' });
        }

        const sendRequest = async (url, quantity, token = '') => {
            const response = await axios.post('https://tiksta.com/action/',
                new URLSearchParams({ ns_action: 'freetool_start', 'freetool[id]': 3, 'freetool[token]': token, 'freetool[process_item]': url, 'freetool[quantity]': quantity }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest', 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }
            );
            return response.data;
        };

        const maxPerDevice = 20, minPerDevice = 10;
        let remaining = targetLikes;
        const devices = [];

        while (remaining > 0) {
            if (remaining >= maxPerDevice) { devices.push(maxPerDevice); remaining -= maxPerDevice; }
            else if (remaining >= minPerDevice) { devices.push(remaining); remaining = 0; }
            else { if (devices.length > 0 && devices[devices.length-1] < maxPerDevice) devices[devices.length-1] += remaining; else devices.push(remaining); remaining = 0; }
        }

        let success = 0, failed = 0;
        for (const qty of devices) {
            const startRes = await sendRequest(tiktokUrl, qty);
            if (!startRes.statu) { failed++; continue; }
            await sendRequest(tiktokUrl, qty, startRes.freetool_process_token || '');
            success++;
            await new Promise(r => setTimeout(r, 500));
        }

        res.json({ ...credit, status: true, result: { target: targetLikes, sessions: devices.length, success, failed, message: `${targetLikes} likes/views akan masuk dalam 5 menit` } });

    } catch (error) {
        res.json({ ...credit, status: false, message: sanitizeError(error) });
    }
};

module.exports = { tiktokBoost };