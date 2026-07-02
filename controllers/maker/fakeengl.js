const axios = require('axios');
const credit = { creator: 'Mayza' };

const fakeEngl = async (req, res) => {
    try {
        const text = req.query.text || 'test';
        res.json({ ...credit, status: false, message: 'Coming soon' });
    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { fakeEngl };
