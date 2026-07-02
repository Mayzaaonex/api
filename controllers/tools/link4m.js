const axios = require('axios');
const crypto = require('crypto');

const link4m = async (req, res) => {
    try {
        const ts = crypto.randomBytes(12).toString('hex');
        const cid = crypto.randomUUID();
        const key = '5vpVLXyw';
        const targetUrl = 'https://link4m.net/go/bvv0BX';

        // CF Solver
        let cfResult;
        try {
            const cfRes = await axios.post('https://cf-solver-renofc.my.id/api/solvebeta', {
                mode: 'waf-session', url: targetUrl
            }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
            cfResult = cfRes.data;
        } catch (e) { cfResult = { error: e.message }; }

        // Get code
        const jsRes = await axios.post('https://s1.what-on.com/widget/client.js',
            new URLSearchParams({
                traffic_session: ts, key, screen: '363 x 785', browser: 'Chrome',
                browserVersion: '149.0.0.0', browserMajorVersion: '149', mobile: 'true',
                os: 'Android', osVersion: '10', cookies: 'true', flashVersion: 'no check',
                lang: 'id-ID', client_id: cid, pathname: '/', href: targetUrl, hostname: 'link4m.net'
            }),
            { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K)' }, timeout: 15000 }
        );

        const match = jsRes.data.match(/"([a-f0-9]{32})"/);
        const code = match ? match[1] : 'NOT FOUND';

        // Step 2
        const hash = crypto.createHash('sha256').update(ts + code + key + Math.floor(Date.now()/1000)).digest('hex');
        const step2Res = await axios.get('https://s1.what-on.com/widget/get_quest_code.html', {
            params: {
                id: ts, code, traffic_session: ts, key, screen: '363 x 785', browser: 'Chrome',
                browserVersion: '149.0.0.0', browserMajorVersion: '149', mobile: 'true',
                os: 'Android', osVersion: '10', cookies: 'true', flashVersion: 'no check',
                lang: 'id-ID', client_id: cid, pathname: '/', href: targetUrl, hostname: 'link4m.net', request: hash
            },
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K)' },
            timeout: 10000
        });

        res.json({
            cf_solver: cfResult,
            js_length: jsRes.data.length,
            code,
            step2: step2Res.data,
            password: step2Res.data?.html || 'NOT FOUND'
        });

    } catch (error) {
        res.json({ error: error.message });
    }
};

module.exports = { link4m };