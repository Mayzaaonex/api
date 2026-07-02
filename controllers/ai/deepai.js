const axios = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');

const EMAIL = 'corap85636@disiok.com';
const PASSWORD = 'anjay123';
const API_KEY = 'tryit-19313776953-71345d10066a13343c30d0e8a36fc45b';

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'api-key': API_KEY,
    'Accept': '*/*',
    'Origin': 'https://deepai.org',
    'Referer': 'https://deepai.org/chat'
};

let token = null;
let cookies = '';

async function login() {
    if (token) return;
    const fdCheck = new FormData();
    fdCheck.append('email', EMAIL);
    await axios.post('https://api.deepai.org/get_user_login_type', fdCheck, { headers: { ...HEADERS } });
    const fdLogin = new FormData();
    fdLogin.append('email', EMAIL);
    fdLogin.append('password', PASSWORD);
    const loginRes = await axios.post('https://api.deepai.org/daily-time-sync/login/', fdLogin, { headers: { ...HEADERS } });
    token = loginRes.data.key;
    cookies = (loginRes.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
}

function generateUUID() { return crypto.randomUUID(); }

const chat = async (req, res) => {
    try {
        const prompt = req.query.message || req.body.message || '';
        if (!prompt) return res.json({ success: false, message: 'Parameter message wajib diisi' });
        await login();
        const fdChat = new FormData();
        fdChat.append('chat_style', 'chat');
        fdChat.append('chatHistory', JSON.stringify([{ role: 'user', content: prompt }]));
        fdChat.append('model', 'standard');
        fdChat.append('session_uuid', generateUUID());
        fdChat.append('sensitivity_request_id', generateUUID());
        fdChat.append('hacker_is_stinky', 'very_stinky');
        fdChat.append('enabled_tools', JSON.stringify(['image_generator', 'image_editor']));
        const result = await axios.post('https://api.deepai.org/hacking_is_a_serious_crime', fdChat, {
            headers: { ...HEADERS, 'Authorization': `Token ${token}`, 'Cookie': cookies },
            timeout: 120000
        });
        res.json({ success: true, author: 'Mayzaa', prompt, response: result.data.trim() });
    } catch (error) {
        res.json({ success: false, author: 'Mayzaa', error: error.response?.status || error.message });
    }
};

module.exports = { chat };