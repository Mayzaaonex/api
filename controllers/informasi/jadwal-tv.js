const axios = require('axios');
const { JSDOM } = require('jsdom');
const credit = { creator: 'Mayza' };

const jadwalTv = async (req, res) => {
    try {
        const channel = req.query.channel || '';
        const baseUrl = 'https://www.jadwaltv.net';
        const url = channel ? `${baseUrl}/channel/${channel.toLowerCase()}` : `${baseUrl}/channel/acara-tv-nasional-saat-ini`;

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 30000
        });

        const dom = new JSDOM(response.data);
        const doc = dom.window.document;

        let result = [];

        if (!channel) {
            const rows = doc.querySelectorAll("table.table-bordered tbody tr");
            let currentChannel = '';
            const jadwal = {};

            rows.forEach(row => {
                const tds = row.querySelectorAll('td');

                if (tds.length === 1 && tds[0].getAttribute('colspan') === '2') {
                    const a = tds[0].querySelector('a');
                    if (a) currentChannel = a.textContent.trim();
                } else if (tds.length >= 2 && currentChannel) {
                    const jam = tds[0].textContent.trim();
                    const acara = tds[1].textContent.trim();
                    if (jam && acara) {
                        if (!jadwal[currentChannel]) jadwal[currentChannel] = [];
                        jadwal[currentChannel].push({ jam, acara });
                    }
                }
            });

            for (const ch in jadwal) {
                result.push({ channel: ch, jadwal: jadwal[ch] });
            }
        } else {
            const rows = doc.querySelectorAll("table.table-bordered tbody tr");
            rows.forEach(row => {
                const tds = row.querySelectorAll('td');
                if (tds.length >= 2) {
                    const jam = tds[0].textContent.trim();
                    const acara = tds[1].textContent.trim();
                    if (jam && acara && jam !== 'Jam' && acara !== 'Acara') {
                        result.push({ jam, acara });
                    }
                }
            });
        }

        res.json({ ...credit, status: result.length > 0, channel: channel || 'semua', result });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { jadwalTv };