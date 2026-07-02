const axios = require('axios');
const credit = { creator: 'Mayza' };

const carbonCode = async (req, res) => {
    try {
        const code = req.query.text || req.query.code || '';
        if (!code) return res.json({ creator: 'Mayza', status: false, message: 'Parameter text wajib diisi' });

        const params = new URLSearchParams({
            bg: 'rgba(226,233,239,1)', t: req.query.theme || 'dracula-pro', wt: 'none',
            l: req.query.lang || 'auto', ds: 'false', dsyoff: '20px', dsblur: '68px',
            wc: 'true', wa: 'true', pv: '56px', ph: '56px',
            ln: 'true', fl: '1', fm: req.query.font || 'Fira Code', fs: '14px',
            lh: '152%', si: 'false', es: '2x', wm: 'false', code
        });

        const carbonUrl = 'https://carbon.now.sh/?' + params.toString();
        const apiUrl = 'https://api.microlink.io/?url=' + encodeURIComponent(carbonUrl) + '&screenshot&element=.export-container&viewport.width=1024&viewport.height=768&meta=false';

        const response = await axios.get(apiUrl, { timeout: 60000 });
        const imageUrl = response.data?.data?.screenshot?.url || '';
        if (!imageUrl) return res.json({ creator: 'Mayza', status: false, message: 'Screenshot gagal' });

        const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 30000 });
        res.set('Content-Type', 'image/png');
        res.set('X-Creator', 'Mayza');
        res.send(imgRes.data);

    } catch (error) {
        res.json({ creator: 'Mayza', status: false, message: error.message });
    }
};

module.exports = { carbonCode };