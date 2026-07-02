const axios = require('axios');
const FormData = require('form-data');
const credit = { creator: 'Mayza' };

const welcome = async (req, res) => {
    try {
        const nama = (req.body?.nama || 'nanasnanas').trim();
        const namagrup = (req.body?.namagrup || 'nanas').trim();
        const memberke = (req.body?.memberke || '1').trim();

        if (!req.files?.file) {
            return res.json({ status: false, creator: 'Mayza', result: { msg: 'File wajib diupload' } });
        }

        const files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
        if (!files[0]) return res.json({ status: false, creator: 'Mayza', result: { msg: 'File wajib diupload' } });

        const form = new FormData();
        form.append('avatar', files[0].data, { filename: files[0].name, contentType: files[0].mimetype });
        form.append('username', nama);
        form.append('guildName', namagrup);
        form.append('memberCount', memberke);

        if (files[1]) {
            form.append('background', files[1].data, { filename: files[1].name, contentType: files[1].mimetype });
        }

        const response = await axios.post('https://api.theresav.biz.id/canvas/welcomev3', form, {
            headers: form.getHeaders(),
            responseType: 'arraybuffer',
            timeout: 30000
        });

        res.set('Content-Type', 'image/png');
        res.send(response.data);

    } catch (error) {
        res.json({ status: false, creator: 'Mayza', result: { msg: error.message } });
    }
};

module.exports = { welcome };