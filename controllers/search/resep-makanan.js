const axios = require('axios');

const resepMakanan = async (req, res) => {
    try {
        const query = req.query.q || '';
        let maxPages = parseInt(req.query.page) || 1;
        if (![1,2,3,4,5].includes(maxPages)) maxPages = 1;
        if (!query) return res.json({ status: false, creator: 'Mayza', message: 'Parameter q wajib diisi' });

        const allRecipes = [];
        let meta = { total: 0 };

        for (let page = 1; page <= maxPages; page++) {
            const url = page === 1
                ? `https://cookpad.com/eng/search/${encodeURIComponent(query)}`
                : `https://cookpad.com/eng/search/${encodeURIComponent(query)}?page=${page}`;

            const response = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
                timeout: 15000
            });

            const html = response.data;

            if (page === 1) {
                const totalMatch = html.match(/text-cookpad-gray-500">\((\d+)\)<\/span>/);
                meta.total = totalMatch ? parseInt(totalMatch[1]) : 0;
            }

            const parts = html.split('<li id="recipe_');
            parts.shift();

            parts.forEach(part => {
                const idMatch = part.match(/^(\d+)/);
                const titleMatch = part.match(/block-link__main[^>]*>([\s\S]*?)<\/a>/);
                const urlMatch = part.match(/href="(\/eng\/recipes\/\d+)"/);
                const imgMatch = part.match(/src="(https:\/\/img-global\.cpcdn\.com\/recipes\/[^"]+\.jpg)"/);
                const timeMatch = part.match(/mise-icon-time[\s\S]*?mise-icon-text">(.*?)<\/span>/);
                const chefMatch = part.match(/text-cookpad-gray-600 text-cookpad-12[^>]*>([\s\S]*?)<\/span>/);

                if (idMatch && titleMatch) {
                    allRecipes.push({
                        id: idMatch[1],
                        title: titleMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
                        url: urlMatch ? 'https://cookpad.com' + urlMatch[1] : '',
                        image: imgMatch ? imgMatch[1] : '',
                        time: timeMatch ? timeMatch[1].replace(/<[^>]+>/g, '').trim() : '',
                        chef: chefMatch ? chefMatch[1].replace(/<[^>]+>/g, '').trim() : ''
                    });
                }
            });

            if (page < maxPages) await new Promise(r => setTimeout(r, 1000));
        }

        res.json({ creator: 'Mayza', status: true, result: { query, total: meta.total, pages_scraped: maxPages, count: allRecipes.length, recipes: allRecipes } });

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, message: error.message });
    }
};

module.exports = { resepMakanan };