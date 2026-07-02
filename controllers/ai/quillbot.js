const axios = require('axios');
const credit = { creator: 'Mayza' };

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const quillbot = async (req, res) => {
    try {
        const text = req.query.text || 'Halo bro gimana kabar mu';
        
        if (!text) {
            return res.json({ ...credit, status: false, message: 'Parameter text diperlukan' });
        }

        const conversationId = uuid();
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
            'Accept': 'text/event-stream, application/json'
        };

        // Visit homepage
        await axios.get('https://quillbot.com/', {
            headers: { ...headers, 'Accept': 'text/html' },
            withCredentials: true
        });

        // Chat
        const chatRes = await axios.post(
            `https://quillbot.com/api/ai-chat/chat/conversation/${conversationId}`,
            {
                message: { content: text + "\n\n" },
                context: { editorContext: '', selectionContext: '', userDialect: 'en-us', apiVersion: 2 },
                origin: { name: 'ai-chat.chat', url: 'https://quillbot.com' }
            },
            {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                    'Origin': 'https://quillbot.com',
                    'Referer': `https://quillbot.com/ai-chat/c/${conversationId}`,
                    'webapp-version': '42.51.6',
                    'qb-product': 'AI-CHAT',
                    'platform-type': 'webapp'
                },
                withCredentials: true
            }
        );

        let result = '';
        const lines = chatRes.data.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('{')) {
                try {
                    const json = JSON.parse(trimmed);
                    if (json.type === 'content') {
                        result += json.content || '';
                    }
                } catch (e) {}
            }
        }

        res.json({
            ...credit,
            status: !!(result),
            input: text,
            result: result || 'Gagal'
        });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { quillbot };