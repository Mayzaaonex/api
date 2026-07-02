const axios = require('axios');
const FormData = require('form-data');
const credit = { creator: 'Mayza' };

const gobox = async (req, res) => {
    try {
        if (!req.files?.file) return res.json({ Status: false, Code: 400, Result_url: 'Kamu belum masukin file!' });

        const file = req.files.file;
        const form = new FormData();
        form.append('file', file.data, { filename: file.name, contentType: file.mimetype });

        const response = await axios.post('https://www.gobox.my.id/upload', form, {
            headers: {
                ...form.getHeaders(),
                'Accept': 'application/json',
                'Origin': 'https://www.gobox.my.id',
                'Referer': 'https://www.gobox.my.id/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 120000
        });

        const data = response.data;
        const resultUrl = data?.url || data?.file || data?.link || '';

        res.json({ Status: !!resultUrl, Code: response.status, Input_Name: file.name, Result_url: resultUrl || response.data, Raw: data });

    } catch (error) {
        res.json({ Status: false, Code: 400, Result_url: error.message });
    }
};

module.exports = { gobox };