const axios = require('axios');
const crypto = require('crypto');
const credit = { creator: 'Mayza' };

function generateUUID() {
    const bytes = crypto.randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = bytes.toString('hex');
    return `${hex.substring(0,8)}-${hex.substring(8,12)}-${hex.substring(12,16)}-${hex.substring(16,20)}-${hex.substring(20)}`;
}

const unlimitedAi = async (req, res) => {
    try {
        const prompt = req.query.prompt || '';
        let model = req.query.model || 'chat-model-reasoning';

        if (!['chat-model-reasoning', 'chat-model-standard'].includes(model)) {
            model = 'chat-model-reasoning';
        }

        if (!prompt) {
            return res.json({ ...credit, status: false, message: 'Parameter prompt wajib diisi' });
        }

        const chatId = generateUUID();
        const messageId = generateUUID();
        const assistantId = generateUUID();
        const deviceId = generateUUID();
        const locale = 'id';
        const timestamp = new Date().toISOString();

        const payload = {
            chatId,
            messages: [
                { id: messageId, role: 'user', content: prompt, parts: [{ type: 'text', text: prompt }], createdAt: timestamp },
                { id: assistantId, role: 'assistant', content: '', parts: [{ type: 'text', text: '' }], createdAt: timestamp }
            ],
            selectedChatModel: model,
            selectedCharacter: null,
            selectedStory: null,
            deviceId,
            locale
        };

        const response = await axios.post('https://app.unlimitedai.chat/api/chat', payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-next-intl-locale': locale,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 45000
        });

        let fullText = '';
        const lines = response.data.split('\n').filter(l => l.trim());
        for (const line of lines) {
            try {
                const parsed = JSON.parse(line);
                if (parsed.type === 'delta' && parsed.delta) {
                    fullText += parsed.delta;
                }
            } catch (e) {}
        }

        res.json({
            ...credit,
            status: true,
            result: {
                text: fullText,
                totalChars: fullText.length,
                chatId,
                deviceId,
                model,
                locale
            }
        });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { unlimitedAi };