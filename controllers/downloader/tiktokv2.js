const axios = require('axios');
const credit = { creator: 'Mayza' };

function generateTT() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const tiktokv2 = async (req, res) => {
    try {
        const url = req.query.url || '';
        if (!url) return res.json({ ...credit, status: false, message: 'Parameter url wajib diisi' });

        const tt = generateTT();
        const response = await axios.post('https://ssstik.io/abc?url=dl',
            new URLSearchParams({ id: url, locale: 'en', tt }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'HX-Request': 'true', 'HX-Trigger': '_gcaptcha_pt', 'HX-Target': 'target', 'HX-Current-URL': 'https://ssstik.io/en', 'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Termux) AppleWebKit/537.36', 'Referer': 'https://ssstik.io/en' },
                timeout: 30000
            }
        );

        const html = response.data;
        const vidMatch = html.match(/href="(https:\/\/tikcdn\.io\/ssstik\/\d+[^"]+)"\s+class="[^"]*without_watermark[^"]*vignette_active[^"]*"/);
        const audMatch = html.match(/href="(https:\/\/tikcdn\.io\/ssstik\/m\/[^"]+)"\s+class="[^"]*music[^"]*"/);
        const capMatch = html.match(/<p class="maintext">([^<]+)<\/p>/);
        const authMatch = html.match(/<h2>([^<]+)<\/h2>/);

        const result = {
            video_tanpa_watermark: vidMatch?.[1] || null,
            audio_mp3: audMatch?.[1] || null,
            caption: capMatch?.[1] || null,
            author: authMatch?.[1] || null
        };

        if (!result.video_tanpa_watermark) throw new Error('Gagal mendapatkan link download');

        res.json({ ...credit, status: true, result });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { tiktokv2 };