const axios = require('axios');
const crypto = require('crypto');
const credit = { creator: 'Mayza' };

function buildKey(str) {
    let out = '', j = 0;
    for (let i = 0; i < 32; i++) {
        out += str.charCodeAt(j).toString(16);
        if (++j >= str.length) j = 0;
    }
    return out;
}

function crack(ivHex, cipherB64, ts) {
    try {
        const key = Buffer.from(buildKey(String(ts)), 'hex');
        const iv = Buffer.from(ivHex, 'hex');
        const ct = Buffer.from(cipherB64, 'base64');

        const decipher = crypto.createDecipheriv('aes-256-cfb', key, iv);
        decipher.setAutoPadding(false);
        let dec = Buffer.concat([decipher.update(ct), decipher.final()]);

        let cut = 0;
        for (let i = 0; i < dec.length; i++) {
            if (dec[i] < 32 && dec[i] !== 9 && dec[i] !== 10 && dec[i] !== 13) break;
            cut = i + 1;
        }
        return dec.slice(0, cut).toString('utf8').trim();
    } catch (e) {
        return null;
    }
}

const radioStream = async (req, res) => {
    try {
        const url = (req.query.url || '').trim();
        if (!url) return res.json({ status: false, creator: 'Mayza', result: { msg: 'Parameter url diperlukan' } });

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
            timeout: 15000
        });

        const html = response.data;

        const tsMatch = html.match(/data-timestamp="(\d+)"/);
        const ts = tsMatch ? tsMatch[1] : null;

        const plMatch = html.match(/formatPlaylist\(\s*(\[[\s\S]*?\])\s*\)/);
        const streams = [];

        if (plMatch && plMatch[1] && ts) {
            const rows = JSON.parse(plMatch[1]);
            rows.forEach(row => {
                if (row.cipher && row.iv) {
                    const streamUrl = crack(row.iv, row.cipher, ts);
                    if (streamUrl && streamUrl.startsWith('http')) {
                        streams.push({ url: streamUrl, type: row.type || 'mp3' });
                    }
                }
            });
        }

        const titleMatch = html.match(/<title>([^<]+)<\/title>/);
        let name = titleMatch ? titleMatch[1] : '';
        name = name.replace(/ live| \| MyTuner Radio| radio station/gi, '').trim();

        res.json({
            status: streams.length > 0,
            creator: 'Mayza',
            input: { url },
            result: { name, total_streams: streams.length, streams }
        });

    } catch (error) {
        res.json({ status: false, creator: 'Mayza', result: { msg: error.message } });
    }
};

module.exports = { radioStream };