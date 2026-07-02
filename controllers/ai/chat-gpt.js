const axios = require('axios');
const credit = { creator: 'Mayzaa' };

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const chatGpt = async (req, res) => {
    try {
        const text = req.query.text || '';
        const model = req.query.model || 'chatgpt';

        const models = {
            chatgpt: { bot_id: 25871, name: 'ChatGPT 5 Nano' },
            deepseek: { bot_id: 25873, name: 'DeepSeek' },
            claude: { bot_id: 25875, name: 'Claude' },
            grok: { bot_id: 25872, name: 'Xai (Grok)' },
            perplexity: { bot_id: 29624, name: 'Perplexity Sonar' },
            llama: { bot_id: 25870, name: 'Meta: Llama 4 Maverick' },
            qwen: { bot_id: 25869, name: 'Qwen 3 30B A3B' }
        };

        if (!text) return res.json({ ...credit, status: false, message: 'Parameter text wajib diisi' });
        if (!models[model]) return res.json({ ...credit, status: false, message: 'Model tidak valid' });

        const cfg = models[model];
        const BASE = 'https://chatgptfree.ai';
        const AJAX = BASE + '/wp-admin/admin-ajax.php';
        const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

        await axios.get(BASE + '/chat/', {
            headers: { 'User-Agent': UA },
            withCredentials: true
        });

        const nonceRes = await axios.post(AJAX, new URLSearchParams({
            action: 'aipkit_get_frontend_chat_nonce',
            bot_id: '25871',
            post_id: '261'
        }), {
            headers: {
                'User-Agent': UA,
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': BASE,
                'Referer': BASE + '/chat/'
            },
            withCredentials: true
        });

        const nonce = nonceRes.data?.data?.nonce || '';
        if (!nonce) throw new Error('Gagal nonce');

        const suid = uuid(), cuid = uuid(), mid = uuid(), ckey = uuid(), ts = String(Date.now());

        const cacheRes = await axios.post(AJAX, new URLSearchParams({
            action: 'aipkit_cache_sse_message',
            bot_id: cfg.bot_id,
            message: text,
            _ajax_nonce: nonce,
            post_id: '261',
            user_client_message_id: mid,
            cache_key: ckey,
            session_id: suid,
            conversation_uuid: cuid,
            _ts: ts
        }), {
            headers: {
                'User-Agent': UA,
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': BASE,
                'Referer': BASE + '/chat/'
            },
            withCredentials: true
        });

        if (!cacheRes.data?.success) throw new Error('Cache failed');

        const streamUrl = `${AJAX}?action=aipkit_frontend_chat_stream&cache_key=${encodeURIComponent(cacheRes.data.data.cache_key)}&bot_id=${cfg.bot_id}&session_id=${suid}&conversation_uuid=${cuid}&post_id=261&_ajax_nonce=${encodeURIComponent(nonce)}&_ts=${ts}`;

        const streamRes = await axios.get(streamUrl, {
            headers: {
                'User-Agent': UA,
                'Accept': 'text/event-stream',
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': BASE,
                'Referer': BASE + '/chat/'
            },
            withCredentials: true
        });

        let fullText = '';
        const lines = streamRes.data.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const j = JSON.parse(line.substring(6));
                    if (j?.delta) fullText += j.delta;
                    if (j?.finished) break;
                } catch (e) {}
            }
        }

        if (!fullText) throw new Error('Response kosong');

        res.json({ ...credit, status: true, result: { model: cfg.name, text: fullText } });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { chatGpt };