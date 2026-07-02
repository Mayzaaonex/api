const axios = require('axios');
const crypto = require('crypto');
const credit = { creator: 'Mayza' };

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const chatday = async (req, res) => {
    try {
        const prompt = req.query.prompt || '';
        const model = req.query.model || 'openai/gpt-5.5';

        if (!prompt) {
            return res.json({ ...credit, status: false, result: 'Parameter prompt wajib diisi' });
        }

        const base_url = 'https://www.chatday.ai';
        const baseHeaders = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
            'Origin': base_url,
            'Referer': base_url + '/chat',
            'Content-Type': 'application/json'
        };

        // Anonymous Sign In
        const loginRes = await axios.post(base_url + '/api/auth/sign-in/anonymous', {}, {
            headers: baseHeaders,
            withCredentials: true
        });

        const cookies = loginRes.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';

        const visitorId = uuidv4().replace(/-/g, '');
        const conversationId = crypto.randomBytes(8).toString('hex').toUpperCase();

        const chatRes = await axios.post(base_url + '/api/v2/chat/anonymous', {
            content: prompt,
            model: model,
            visitorId: visitorId,
            conversationId: conversationId
        }, {
            headers: {
                ...baseHeaders,
                'Cookie': cookies,
                'Accept': 'text/event-stream'
            }
        });

        let answer = '';
        const lines = chatRes.data.split('\n');
        for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const json = line.substring(5).trim();
            if (!json) continue;
            try {
                const evt = JSON.parse(json);
                if (evt.type === 'text-delta' && evt.delta) {
                    answer += evt.delta;
                }
            } catch (e) {}
        }

        res.json({
            ...credit,
            status: true,
            result: { model, response: answer }
        });

    } catch (error) {
        res.json({ ...credit, status: false, result: error.message });
    }
};

module.exports = { chatday };