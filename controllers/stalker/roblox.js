const axios = require('axios');
const credit = { creator: 'Mayza' };

const removeKeysRecursive = (obj, keysToRemove) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(v => removeKeysRecursive(v, keysToRemove));
    const newObj = {};
    for (const key in obj) {
        if (!keysToRemove.includes(key)) newObj[key] = removeKeysRecursive(obj[key], keysToRemove);
    }
    return newObj;
};

const roblox = async (req, res) => {
    try {
        const username = req.query.username || '';
        if (!username) {
            return res.json(removeKeysRecursive({ ...credit, status: false, message: 'Parameter username diperlukan' }, ['creator', 'Creator', 'author', 'Author']));
        }

        const response = await axios.get('https://api.sxtream.my.id/stalk/roblox', {
            params: { username },
            timeout: 15000
        });

        let data = { ...credit, status: !!response.data, input: username, result: response.data };
        data = removeKeysRecursive(data, ['creator', 'Creator', 'author', 'Author']);
        res.json(data);

    } catch (error) {
        res.json(removeKeysRecursive({ ...credit, status: false, message: error.message }, ['creator', 'Creator', 'author', 'Author']));
    }
};

module.exports = { roblox };