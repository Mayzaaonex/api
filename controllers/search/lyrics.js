const axios = require('axios');
const { JSDOM } = require('jsdom');

const lyrics = async (req, res) => {
    try {
        const query = req.query.q || '';
        if (!query) return res.json({ status: false, creator: 'Mayza', message: 'Parameter q wajib diisi' });

        const response = await axios.get('https://www.lyrics.com/lyrics/' + encodeURIComponent(query), {
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36' },
            timeout: 30000
        });

        const dom = new JSDOM(response.data);
        const doc = dom.window.document;
        const items = doc.querySelectorAll('.sec-lyric.clearfix');
        const results = [];

        items.forEach(item => {
            const titleEl = item.querySelector('.lyric-meta-title a');
            const artistEl = item.querySelector('.lyric-meta-artists a, .lyric-meta-album-artist a');
            const lyricsEl = item.querySelector('pre.lyric-body');

            results.push({
                title: titleEl?.textContent?.trim() || '',
                artist: artistEl?.textContent?.trim() || '',
                url: titleEl?.href ? 'https://www.lyrics.com' + titleEl.getAttribute('href') : null,
                lyrics: lyricsEl?.textContent?.replace(/\s+\n/g, '\n').trim() || ''
            });
        });

        res.json({ status: true, creator: 'Mayza', result: { total: results.length, data: results } });

    } catch (error) {
        res.json({ status: false, creator: 'Mayza', message: error.message });
    }
};

module.exports = { lyrics };