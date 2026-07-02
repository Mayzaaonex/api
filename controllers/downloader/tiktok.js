const axios = require('axios');
const credit = { creator: 'Mayzaa' };

function generateTT() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function extractData(html) {
    const data = {};
    const vidMatch = html.match(/href="(https:\/\/tikcdn\.io\/ssstik\/\d+[^"]+)"\s+class="[^"]*without_watermark[^"]*vignette_active[^"]*"/);
    if (vidMatch) data.video_tanpa_watermark = vidMatch[1];
    const audMatch = html.match(/href="(https:\/\/tikcdn\.io\/ssstik\/m\/[^"]+)"\s+class="[^"]*music[^"]*"/);
    if (audMatch) data.audio_mp3 = audMatch[1];
    const capMatch = html.match(/<p class="maintext">([^<]+)<\/p>/);
    if (capMatch) data.caption = capMatch[1];
    const authMatch = html.match(/<h2>([^<]+)<\/h2>/);
    if (authMatch) data.author = authMatch[1];
    return data;
}

const tiktok = async (req, res) => {
    try {
        const url = req.query.url || '';
        if (!url) return res.json({ ...credit, status: false, message: 'Masukkan URL TikTok' });

        const tt = generateTT();
        const response = await axios.post('https://ssstik.io/abc?url=dl',
            new URLSearchParams({ id: url, locale: 'en', tt }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'HX-Request': 'true',
                    'HX-Trigger': '_gcaptcha_pt',
                    'HX-Target': 'target',
                    'HX-Current-URL': 'https://ssstik.io/en',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Termux) AppleWebKit/537.36',
                    'Referer': 'https://ssstik.io/en'
                },
                timeout: 30000
            }
        );

        const hasil = extractData(response.data);
        if (!hasil.video_tanpa_watermark) throw new Error('Gagal mendapatkan link');

        res.json({ ...credit, status: true, data: hasil });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { tiktok };