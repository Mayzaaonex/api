const axios = require('axios');
const { JSDOM } = require('jsdom');
const credit = { creator: 'Mayza' };

const whatsappChannel = async (req, res) => {
    try {
        const url = req.query.url || '';
        if (!url) return res.json({ ...credit, status: false, message: 'Parameter url wajib diisi' });

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/139 Mobile Safari/537.36' },
            timeout: 15000
        });

        const dom = new JSDOM(response.data);
        const doc = dom.window.document;

        const rawTitle = doc.querySelector('title')?.textContent?.trim() || '';
        const rawDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

        const name = rawTitle.replace(/\s*-\s*WhatsApp channel/i, '').trim();
        let desc = rawDesc.replace(new RegExp(`Follow\\s+${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'?s?\\s+WhatsApp Channel\\.`, 'i'), '');
        desc = desc.replace(/Join\s+\d+\s+followers?.*/i, '').replace(/\s+/g, ' ').trim();

        res.json({ ...credit, status: true, result: { name, desc, image } });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { whatsappChannel };