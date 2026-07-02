const axios = require('axios');
const credit = { creator: 'Mayza' };

const allGame2 = async (req, res) => {
    try {
        const game = req.query.game || 'tebaklagu';

        const urls = {
            tebaklagu: 'https://raw.githubusercontent.com/qisyana/scrape/main/tebaklagu.json',
            tebakgame: 'https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json',
            tebakjkt: 'https://raw.githubusercontent.com/siputzx/tebak-jkt/refs/heads/main/tebak.json',
            tebakkarakterff: 'https://raw.githubusercontent.com/siputzx/karakter-freefire/refs/heads/main/data.json',
            tebaklirik: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaklirik.json',
            siapakahaku: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json',
            tekateki: 'https://raw.githubusercontent.com/BochilTeam/database/master/games/tekateki.json',
            tebakkartun: null,
            tebakheroml: null,
            tebakbendera: null
        };

        if (!(game in urls)) {
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

        // Special: tebakkartun (placeholder)
        if (game === 'tebakkartun') {
            const result = { name: 'SpongeBob', img: 'https://i.pinimg.com/736x/d2/b2/49/d2b2493f88da017b20b2f5ae1ad6be86.jpg' };
            return res.json({ ...credit, status: true, game, result });
        }

        // Special: tebakheroml (placeholder)
        if (game === 'tebakheroml') {
            return res.json({ ...credit, status: false, message: 'Game tebakheroml belum tersedia' });
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

module.exports = { allGame2 };