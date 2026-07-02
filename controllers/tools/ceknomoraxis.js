const axios = require('axios');
const credit = { creator: 'Mayza' };

const ceknomoraxis = async (req, res) => {
    try {
        const number = req.query.number || '';
        if (!number) return res.json({ success: false, message: "Parameter 'number' wajib diisi", example: "?number=08123456789" });
        if (!/^[0-9]{10,13}$/.test(number)) return res.json({ success: false, message: "Format nomor tidak valid. Gunakan 10-13 digit angka" });

        const response = await axios.get('https://xl-ku.my.id/end.php', {
            params: { check: 'package', number },
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 30000
        });

        res.json(response.data);
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

module.exports = { ceknomoraxis };