const axios = require('axios');
const credit = { creator: 'Mayza' };
const BASE_URL = 'https://mlbb.io/api';

const mlbb = async (req, res) => {
    try {
        const action = req.query.action || 'items';
        const hero = req.query.hero || '';

        let result;
        switch (action) {
            case 'build':
                if (!hero) throw new Error('Parameter hero diperlukan');
                result = (await axios.get(`${BASE_URL}/item/item-build/hero/${hero.charAt(0).toUpperCase() + hero.slice(1)}`, {
                    headers: { 'Accept': 'application/json', 'Origin': 'https://mlbb.io', 'User-Agent': 'Mozilla/5.0' },
                    timeout: 15000
                })).data;
                break;
            case 'items':
                result = (await axios.get(`${BASE_URL}/item/all-items`, {
                    headers: { 'Accept': 'application/json', 'Origin': 'https://mlbb.io', 'User-Agent': 'Mozilla/5.0' },
                    timeout: 15000
                })).data;
                break;
            case 'emblems':
                result = (await axios.get(`${BASE_URL}/emblem/main-emblems`, {
                    headers: { 'Accept': 'application/json', 'Origin': 'https://mlbb.io', 'User-Agent': 'Mozilla/5.0' },
                    timeout: 15000
                })).data;
                break;
            case 'ability':
                result = (await axios.get(`${BASE_URL}/emblem/ability-emblems`, {
                    headers: { 'Accept': 'application/json', 'Origin': 'https://mlbb.io', 'User-Agent': 'Mozilla/5.0' },
                    timeout: 15000
                })).data;
                break;
            default:
                throw new Error('Action tidak valid (build|items|emblems|ability)');
        }

        res.json({ ...credit, status: true, action, result });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { mlbb };