const axios = require('axios');
const credit = { creator: 'Mayza' };

const pinterestDownload = async (req, res) => {
    try {
        const query = req.query.q || '';
        let limit = parseInt(req.query.limit) || 5;
        if (![5, 10, 20].includes(limit)) limit = 5;
        if (!query) return res.json({ ...credit, status: false, message: 'Parameter q wajib diisi' });

        const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0';

        const sessionRes = await axios.get('https://id.pinterest.com/', {
            headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
            withCredentials: true
        });

        const cookies = sessionRes.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
        const csrf = cookies.match(/csrftoken=([^;]+)/)?.[1] || '';

        if (!cookies) throw new Error('Gagal mendapatkan session');

        const sourceUrl = '/search/pins/?q=' + encodeURIComponent(query);
        const data = JSON.stringify({
            options: { query, scope: 'pins', page_size: limit, refine_search_with_filters: true },
            context: {}
        });

        const apiUrl = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=${encodeURIComponent(sourceUrl)}&data=${encodeURIComponent(data)}&_=${Date.now()}`;

        const headers = {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': UA,
            'Referer': 'https://id.pinterest.com' + sourceUrl,
            'X-Requested-With': 'XMLHttpRequest',
            'X-App-Version': '6d51d5a',
            'X-Pinterest-Appstate': 'active',
            'X-Pinterest-Source-Url': sourceUrl,
            'Cookie': cookies
        };
        if (csrf) headers['X-CSRFToken'] = csrf;

        const result = await axios.get(apiUrl, { headers, timeout: 15000 });

        const payload = result.data?.resource_response?.data || [];
        if (!payload) throw new Error('No data');

        const arr = payload.results || payload;
        const results = [];

        for (const pin of arr) {
            if (!pin.id) continue;
            results.push({
                title: pin.title || pin.grid_title || '',
                image: pin.images?.orig?.url || pin.images?.['736x']?.url || null,
                video: pin.videos?.video_list?.V_HLSV4?.url || pin.videos?.video_list?.V_EXP7?.url || pin.videos?.video_list?.V_720P?.url || null,
                username: pin.pinner?.username || null,
                full_name: pin.pinner?.full_name || null,
                pin_url: `https://id.pinterest.com/pin/${pin.id}/`
            });
        }

        res.json({ ...credit, status: true, result: { query, count: results.length, bookmark: payload.bookmark || null, results } });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { pinterestDownload };