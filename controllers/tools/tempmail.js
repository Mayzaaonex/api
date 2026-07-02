const axios = require('axios');
const crypto = require('crypto');
const credit = { creator: 'Mayza' };

const BASE_URL = 'https://temp-mail.app/api';
const UA = 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 Chrome/148.0.0.0 Mobile Safari/537.36';

function generateUUID() {
    return crypto.randomUUID();
}

const tempmail = async (req, res) => {
    try {
        const mode = req.query.mode || 'generate';
        const visitorId = req.query.id || '';

        const allowedModes = ['generate', 'inbox'];
        if (!allowedModes.includes(mode)) {
            return res.json({ ...credit, status: false, message: 'Mode tidak valid. Pilih: generate, inbox' });
        }

        if (mode === 'inbox' && !visitorId) {
            return res.json({ ...credit, status: false, message: 'Parameter id (visitor_id) wajib diisi' });
        }

        // GENERATE
        if (mode === 'generate') {
            let vid = generateUUID();
            let result = await axios.get(`${BASE_URL}/mail/address`, {
                params: { refresh: 'false', expire: 1440, part: 'main' },
                headers: { 'User-Agent': UA, 'Accept': '*/*', 'Referer': 'https://temp-mail.app/', 'visitor-id': vid },
                timeout: 15000
            });

            let data = result.data;
            if (!data || !data.address) {
                vid = generateUUID();
                result = await axios.get(`${BASE_URL}/mail/address`, {
                    params: { refresh: 'false', expire: 1440, part: 'main' },
                    headers: { 'User-Agent': UA, 'Accept': '*/*', 'Referer': 'https://temp-mail.app/', 'visitor-id': vid },
                    timeout: 15000
                });
                data = result.data;
            }

            if (!data || !data.address) throw new Error('Gagal generate email');

            return res.json({
                ...credit, status: true,
                result: {
                    address: data.address,
                    expire_minutes: data.expire || 1440,
                    remaining_minutes: Math.round((data.remainingTime || 0) / 60),
                    visitor_id: vid
                }
            });
        }

        // INBOX
        if (mode === 'inbox') {
            // Ambil email
            const addrResult = await axios.get(`${BASE_URL}/mail/address`, {
                params: { refresh: 'false', expire: 1440, part: 'main' },
                headers: { 'User-Agent': UA, 'Accept': '*/*', 'Referer': 'https://temp-mail.app/', 'visitor-id': visitorId },
                timeout: 15000
            });

            const email = addrResult.data?.address || '';

            // Ambil messages
            const msgResult = await axios.get(`${BASE_URL}/mail/list`, {
                params: { part: 'main' },
                headers: { 'User-Agent': UA, 'Accept': '*/*', 'Referer': 'https://temp-mail.app/', 'visitor-id': visitorId },
                timeout: 15000
            });

            if (msgResult.status !== 200) throw new Error('Gagal akses inbox (HTTP ' + msgResult.status + ')');

            const messages = msgResult.data?.message || [];
            const formatted = messages.map(msg => {
                let cleanContent = (msg.content || '').replace(/<[^>]+>/g, '');
                cleanContent = cleanContent.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
                return {
                    id: msg.id || '',
                    from: msg.fromName || msg.fromAddress || '',
                    subject: msg.subject || '(no subject)',
                    preview: msg.preview || '',
                    content: cleanContent.trim(),
                    date: msg.date || '',
                    is_read: msg.isRead || false
                };
            });

            return res.json({
                ...credit, status: true,
                result: { email, total: formatted.length, messages: formatted }
            });
        }

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { tempmail };