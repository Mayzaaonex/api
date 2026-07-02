const axios = require('axios');
const credit = { creator: 'Mayza' };

const promptGenerator = async (req, res) => {
    try {
        const text = req.query.text || 'king biologi';
        
        if (!text) {
            return res.json({ ...credit, status: false, message: 'Parameter text diperlukan' });
        }

        let result = { english: '', indonesian: '' };

        for (let i = 0; i < 3; i++) {
            try {
                const response = await axios.post('https://generateprompt-faddai.vercel.app/api/generate', {
                    prompt: text,
                    mode: 'stream'
                }, {
                    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
                    timeout: 60000
                });

                const lines = response.data.split('\n');
                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    try {
                        const data = JSON.parse(line.substring(6));
                        if (data.english) result.english = data.english;
                        if (data.indonesian) result.indonesian = data.indonesian;
                    } catch (e) {}
                }

                if (result.english || result.indonesian) break;
                await new Promise(r => setTimeout(r, 500));
            } catch (e) {}
        }

        res.json({
            ...credit,
            status: !!(result.english),
            input: text,
            result
        });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { promptGenerator };