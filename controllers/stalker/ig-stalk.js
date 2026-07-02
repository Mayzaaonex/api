const axios = require('axios');
const credit = { creator: 'Mayzaa' };

const removeKeysRecursive = (obj, keysToRemove) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(v => removeKeysRecursive(v, keysToRemove));
    const newObj = {};
    for (const key in obj) {
        if (!keysToRemove.includes(key)) newObj[key] = removeKeysRecursive(obj[key], keysToRemove);
    }
    return newObj;
};

const igStalk = async (req, res) => {
    try {
        const username = req.query.username || '';
        if (!username) {
            const data = { ...credit, status: false, message: 'Parameter username diperlukan' };
            return res.json(removeKeysRecursive(data, ['creator', 'Creator', 'author', 'Author']));
        }

        const response = await axios.get('https://fadd-alltools.vercel.app/api/igstalk', {
            params: { username },
            timeout: 15000
        });

        const result = response.data;
        let data = { ...credit, status: !!result?.status, input: username, result: result?.result || result };
        data = removeKeysRecursive(data, ['creator', 'Creator', 'author', 'Author']);
        res.json(data);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { igStalk };