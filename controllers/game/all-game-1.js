const axios = require('axios');
const credit = { creator: 'Mayza' };

const allGame1 = async (req, res) => {
    try {
        const game = req.query.game || 'caklontong';

        const urls = {
            caklontong: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/caklontong.json',
            family100: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json',
            lengkapikalimat: 'https://raw.githubusercontent.com/qisyana/scrape/main/lengkapikalimat.json',
            susunkata: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json',
            tebaktebakan: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaktebakan.json',
            asahotak: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/asahotak.json',
            tebakgambar: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json',
            tebakkalimat: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkalimat.json',
            tebakkata: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json',
            tebakkimia: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json',
            tebaksurah: `https://api.alquran.cloud/v1/ayah/${Math.floor(Math.random() * 6236) + 1}/ar.alafasy`
        };

        if (!urls[game]) {
            return res.json({ ...credit, status: false, message: 'Game tidak valid' });
        }

        // Special: tebakbendera
        if (game === 'tebakbendera') {
            const codesRes = await axios.get('https://flagcdn.com/en/codes.json', { timeout: 15000 });
            const keys = Object.keys(codesRes.data);
            const key = keys[Math.floor(Math.random() * keys.length)];
            const result = { name: codesRes.data[key], img: `https://flagpedia.net/data/flags/ultra/${key}.png` };
            return res.json({ ...credit, status: true, game, result });
        }

        const response = await axios.get(urls[game], { timeout: 15000 });
        const data = response.data;
        if (!data) return res.json({ ...credit, status: false, message: 'Gagal' });

        const result = data.data ? data.data : data[Math.floor(Math.random() * data.length)];
        res.json({ ...credit, status: true, game, result });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { allGame1 };