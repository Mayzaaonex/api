const axios = require('axios');
const credit = { creator: 'Mayza' };

const cerdasCermat = async (req, res) => {
    try {
        const mapel = req.query.mapel || 'matematika';
        let jumlahsoal = parseInt(req.query.jumlahsoal) || 5;
        jumlahsoal = Math.max(5, Math.min(10, jumlahsoal));

        const subjects = ['bindo', 'tik', 'pkn', 'bing', 'penjas', 'pai', 'matematika', 'jawa', 'ips', 'ipa'];
        if (!subjects.includes(mapel)) {
            return res.json({ ...credit, status: false, message: 'Mapel tidak valid' });
        }

        const url = `https://gist.githubusercontent.com/siputzx/298d2d3bd5901494537b9848e35dab9f/raw/25f5dcfef0d97141c555c2bbb94fe1f3d1f76cb3/${mapel}.json`;
        const response = await axios.get(url, { timeout: 15000 });
        const all = response.data;
        if (!all) return res.json({ ...credit, status: false, message: 'Gagal fetch data' });

        // Shuffle
        const shuffled = all.sort(() => Math.random() - 0.5);
        const soal = shuffled.slice(0, jumlahsoal);

        res.json({ ...credit, status: true, mapel, jumlah_soal: jumlahsoal, soal });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { cerdasCermat };