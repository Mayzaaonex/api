const axios = require('axios');
const crypto = require('crypto');
const credit = { creator: 'Mayzaa' };

function randStr(len) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let str = '';
    for (let i = 0; i < len; i++) str += chars.charAt(Math.floor(Math.random() * chars.length));
    return str;
}

const gemini = async (req, res) => {
    try {
        const text = req.query.text || 'Hello';
        if (!text) return res.json({ ...credit, status: false, message: 'Parameter text diperlukan' });

        const deviceId = crypto.randomBytes(16).toString('hex');
        const fSid = '-' + Math.floor(Math.random() * 9e18 + 1e18);
        const atToken = 'AOOh' + randStr(22) + ':' + (Date.now() * 1000);
        const tokenBlob = '!' + randStr(24) + 'NAAa-PB6hnjxC' + randStr(18) + 'AEABE' + randStr(12) +
            'Z1IzrYRasYCYYnM4bZXAlvfpPcJe2g2Ye8XDL3Ck5BCikk5IYm5xZrnIsIkA0SEgfgSLBh-eSq-mq5McSAgAA' +
            randStr(8) + 'SAAAC' + randStr(8) + 'BB34ARK' + randStr(1100);
        const reqId = Math.floor(Math.random() * 9e6 + 1e6);

        const inner = [
            [text, 0, null, null, null, null, 0],
            ['id'],
            ['', '', '', null, null, null, null, null, null, ''],
            tokenBlob,
            crypto.randomBytes(16).toString('hex'),
            null,
            [0],
            1, null, null, 1, 0, null, null, null, null, null, [[0]], 0,
            null, null, null, null, null, null, null, null, 1, null, null, [4],
            null, null, null, null, null, null, null, null, null, null, [2],
            null, null, null, null, null, null, null, null, null, null, null, 0,
            null, null, null, null, null, deviceId, null, [], null, null, null, null, null, null, 1,
            null, null, null, null, null, null, null, null, null, null, 1
        ];

        const body = 'f.req=' + encodeURIComponent(JSON.stringify([null, JSON.stringify(inner)])) + '&at=' + encodeURIComponent(atToken);
        const url = 'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate' +
            '?bl=boq_assistant-bard-web-server_20260603.11_p0&f.sid=' + fSid + '&hl=id&_reqid=' + reqId + '&rt=c';

        const response = await axios.post(url, body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Origin': 'https://gemini.google.com',
                'Referer': 'https://gemini.google.com/',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'sec-ch-ua-platform': '"Android"',
                'x-same-domain': '1',
                'x-goog-ext-525001261-jspb': `[1,null,null,null,"fbb127bbb056c959",null,null,0,[4],null,null,1,null,null,1,null,"${deviceId}"]`,
                'x-goog-ext-525005358-jspb': `["${deviceId}",1]`
            },
            timeout: 120000
        });

        let textResult = '';
        for (let line of response.data.split('\n')) {
            line = line.trim();
            if (line.startsWith(")]}'")) line = line.substring(4);
            if (!line || !isNaN(line)) continue;
            try {
                const parsed = JSON.parse(line);
                if (!parsed?.[0]) continue;
                const encoded = parsed[0][2];
                if (!encoded) continue;
                const innerData = JSON.parse(encoded);
                for (const block of (innerData[4] || [])) {
                    if (Array.isArray(block[1]) && block[1][0]) textResult = block[1][0];
                }
            } catch (e) {}
        }

        res.json({
            ...credit,
            status: !!textResult,
            input: text,
            result: textResult || 'Gagal mendapatkan response'
        });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { gemini };