const axios = require('axios');
const crypto = require('crypto');

const SECRET = '376136387538459893883312310911992847112448894410210511297108';
const VERSION = 61;
const CLIENT_VERSION = '1.2.88.61.ge172202b';
const UA = 'Mozilla/5.0 (Linux; Android 16; NX729J) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.34 Mobile Safari/537.36';

function uuidv4() {
    const bytes = crypto.randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = bytes.toString('hex');
    return `${hex.substring(0,8)}-${hex.substring(8,12)}-${hex.substring(12,16)}-${hex.substring(16,20)}-${hex.substring(20)}`;
}

function generateTOTP(tsms) {
    const counter = Math.floor((tsms / 1000) / 30);
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(counter));
    const hmac = crypto.createHmac('sha1', SECRET).update(buffer).digest();
    const offset = hmac[hmac.length - 1] & 0xf;
    const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
    return String(code).padStart(6, '0');
}

const spotiplay = async (req, res) => {
    try {
        const query = req.query.q || '';
        if (!query) return res.json({ status: false, creator: 'Mayza', message: 'Parameter q wajib diisi' });

        let trackUrl;

        if (query.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/)) {
            trackUrl = query;
        } else {
            const sts = Math.floor(Date.now() / 1000);
            const totp = generateTOTP(Date.now());
            const totpServer = generateTOTP(sts * 1000);

            const tokenRes = await axios.get(`https://open.spotify.com/api/token?reason=init&productType=web-player&totp=${totp}&totpServer=${totpServer}&totpVer=${VERSION}`, {
                headers: { 'User-Agent': UA, 'Referer': 'https://open.spotify.com/', 'Origin': 'https://open.spotify.com', 'Accept': 'application/json' },
                timeout: 20000
            });

            if (!tokenRes.data?.accessToken) return res.json({ status: false, creator: 'Mayza', message: 'Gagal mendapatkan token' });

            const clientRes = await axios.post('https://clienttoken.spotify.com/v1/clienttoken', {
                client_data: {
                    client_version: CLIENT_VERSION,
                    client_id: tokenRes.data.clientId,
                    js_sdk_data: { device_brand: 'unknown', device_model: 'unknown', os: 'linux', os_version: '24.04', device_id: uuidv4(), device_type: 'computer' }
                }
            }, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 });

            const accessToken = tokenRes.data.accessToken;
            const clientToken = clientRes.data?.granted_token?.token || '';

            const searchRes = await axios.post('https://api-partner.spotify.com/pathfinder/v2/query', {
                variables: { searchTerm: query, offset: 0, limit: 10, numberOfTopResults: 5, includeAudiobooks: true, includeArtistHasConcertsField: false, includePreReleases: true, includeAuthors: false, includeEpisodeContentRatingsV2: false },
                operationName: 'searchDesktop',
                extensions: { persistedQuery: { version: 1, sha256Hash: '21b3fe49546912ba782db5c47e9ef5a7dbd20329520ba0c7d0fcfadee671d24e' } }
            }, {
                headers: { 'Accept-Language': 'en', 'App-Platform': 'WebPlayer', 'Authorization': `Bearer ${accessToken}`, 'Client-Token': clientToken, 'Spotify-App-Version': CLIENT_VERSION, 'Content-Type': 'application/json', 'User-Agent': UA, 'Referer': 'https://open.spotify.com/', 'Origin': 'https://open.spotify.com', 'Accept': 'application/json' },
                timeout: 20000
            });

            const searchData = searchRes.data?.data?.searchV2 || {};
            let trackItems = searchData.tracksV2?.items || [];
            if (!trackItems.length) {
                for (const item of (searchData.topResultsV2?.itemsV2 || [])) {
                    if (item.item?.__typename === 'TrackResponseWrapper') trackItems.push(item);
                }
            }

            if (!trackItems.length) return res.json({ status: false, creator: 'Mayza', message: 'Lagu tidak ditemukan' });

            const t = trackItems[0].item?.data || trackItems[0].data || trackItems[0];
            const uri = t.uri?.split(':') || [];
            trackUrl = `https://open.spotify.com/track/${uri[2] || ''}`;
        }

        const dlRes = await axios.post('https://musicfab.io/api/spotify', { url: trackUrl }, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36', 'Accept': '*/*', 'Content-Type': 'application/json', 'Origin': 'https://musicfab.io', 'Referer': 'https://musicfab.io/' },
            timeout: 60000
        });

        const downloadUrl = dlRes.data?.data?.metadata?.download || '';
        if (!downloadUrl) return res.json({ status: false, creator: 'Mayza', message: 'Gagal download' });

        const audioRes = await axios.get(downloadUrl, { responseType: 'stream', timeout: 0 });
        res.set('Content-Type', 'audio/mpeg');
        audioRes.data.pipe(res);

    } catch (error) {
        res.json({ status: false, creator: 'Mayza', message: error.message });
    }
};

module.exports = { spotiplay };