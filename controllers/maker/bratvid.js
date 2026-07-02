const axios = require('axios');
const credit = { creator: 'Mayza' };

const bratvid = async (req, res) => {
    try {
        const text = req.query.text || 'brat';
        res.json({ ...credit, status: false, message: 'Coming soon' });
    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { bratvid };
