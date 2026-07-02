const axios = require('axios');
const { JSDOM } = require('jsdom');
const credit = { creator: 'Mayza' };

const fontSearch = async (req, res) => {
    try {
        const query = req.query.query || '';
        if (!query) return res.json({ ...credit, status: false, message: 'Parameter query diperlukan' });

        const htmlRes = await axios.get('https://dafontstyle.io/?s=' + encodeURIComponent(query), {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 15000
        });

        const dom = new JSDOM(htmlRes.data);
        const doc = dom.window.document;
        const items = doc.querySelectorAll('li.entry-list-item');
        const fonts = [];

        for (const item of items) {
            const titleEl = item.querySelector('h2.entry-title a');
            const imgEl = item.querySelector('img.wp-post-image');
            const catEl = item.querySelector('span.category-links a');
            const fontUrl = titleEl?.href || '';

            let downloadUrl = null;
            if (fontUrl) {
                try {
                    const detailRes = await axios.get(fontUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 });
                    const match = detailRes.data.match(/data-zip="([^"]+)"/);
                    downloadUrl = match ? match[1] : null;
                } catch (e) {}
            }

            fonts.push({
                title: titleEl?.textContent?.trim() || '',
                url: fontUrl,
                image: imgEl?.src || '',
                category: catEl?.textContent?.trim() || '',
                download_url: downloadUrl
            });
        }

        res.json({ ...credit, status: true, query, total: fonts.length, result: fonts });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { fontSearch };