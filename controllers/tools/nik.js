const axios = require('axios');
const credit = { creator: 'Mayza' };

const sanitizeError = (error) => {
    const msg = error.message || '';
    if (msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT')) return 'Failed to connect to target';
    if (msg.includes(' certificate') || msg.includes('SSL')) return 'SSL error';
    return 'Internal error';
};

const isValidNIK = (nik) => {
    if (!nik || typeof nik !== 'string') return false;
    if (!/^\d{16}$/.test(nik)) return false;
    return true;
};

const nik = async (req, res) => {
    try {
        const nikNumber = req.query.nik || '';

        if (!isValidNIK(nikNumber)) {
            return res.json({ ...credit, success: false, message: 'NIK harus 16 digit angka' });
        }

        const response = await axios.post('https://nik.zakiego.com/api/trpc/nik.read?batch=1',
            { 0: { json: { nik: nikNumber } } },
            {
                headers: { 'Origin': 'https://nik.zakiego.com', 'Referer': 'https://nik.zakiego.com/', 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
                timeout: 15000
            }
        );

        res.json({ ...credit, success: true, result: response.data });

    } catch (error) {
        res.json({ ...credit, success: false, message: sanitizeError(error) });
    }
};

module.exports = { nik };