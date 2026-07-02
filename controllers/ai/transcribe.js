const axios = require('axios');
const credit = { creator: 'Mayza' };
const ASSEMBLYAI_KEY = 'b6d6101e7ded44a6921bc5a8146765a1';

const transcribe = async (req, res) => {
    try {
        const url = req.query.url || '';

        if (!url) {
            return res.json({ ...credit, status: false, message: 'Parameter url wajib diisi' });
        }

        // Step 1: Download audio via Cobalt
        const cobaltRes = await axios.post('https://cobalt-api-production-cd7d.up.railway.app/', { url }, {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            timeout: 30000
        });

        const audioUrl = cobaltRes.data?.url || '';
        if (!audioUrl) throw new Error('Gagal download video');

        // Step 2: Submit ke AssemblyAI
        const submitRes = await axios.post('https://api.assemblyai.com/v2/transcript', {
            audio_url: audioUrl,
            speaker_labels: true,
            language_code: 'en_us'
        }, {
            headers: { 'Authorization': ASSEMBLYAI_KEY, 'Content-Type': 'application/json' },
            timeout: 30000
        });

        const taskId = submitRes.data?.id || '';
        if (!taskId) throw new Error('Gagal submit transcript');

        // Step 3: Polling
        let result = null;
        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 2000));
            const pollRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${taskId}`, {
                headers: { 'Authorization': ASSEMBLYAI_KEY },
                timeout: 30000
            });

            if (pollRes.data?.status === 'completed') {
                result = pollRes.data;
                break;
            }
            if (pollRes.data?.status === 'error') throw new Error('Transcript error');
        }

        if (!result || result.status !== 'completed') throw new Error('Timeout');

        res.json({
            ...credit,
            status: true,
            result: {
                text: result.text || '',
                duration: result.audio_duration || 0,
                language: result.language_code || '',
                words: result.words || []
            }
        });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { transcribe };