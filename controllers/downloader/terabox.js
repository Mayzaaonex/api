const axios = require('axios');
const credit = { creator: 'Mayza' };
const ORIGIN = 'https://1024teradownloader.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0';

const terabox = async (req, res) => {
    try {
        const url = req.query.url || '';
        if (!url) return res.json({ ...credit, status: false, message: 'Parameter url wajib diisi' });

        const sessionRes = await axios.get(ORIGIN + '/', {
            headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
            withCredentials: true
        });

        const cookies = sessionRes.headers['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '';
        if (!cookies) throw new Error('No session cookies issued');

        const apiRes = await axios.post(ORIGIN + '/api/stream', `url=${encodeURIComponent(url)}`, {
            headers: { 'User-Agent': UA, 'Accept': '*/*', 'Origin': ORIGIN, 'Referer': ORIGIN + '/', 'Cookie': cookies, 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 30000
        });

        if (apiRes.data?.status !== 'success') throw new Error(apiRes.data?.message || 'Terabox API error');

        const files = (apiRes.data.list || []).map(f => ({
            id: f.fs_id || '',
            name: f.name || '',
            path: f.file_path || '',
            type: f.type || '',
            isFolder: f.is_dir === '1',
            size: f.size || 0,
            sizeFormatted: f.size_formatted || '',
            downloadUrl: f.normal_dlink || '',
            folder: f.folder || ''
        }));

        res.json({ ...credit, status: true, result: { sourceUrl: url, totalFiles: apiRes.data.total_files || 0, totalFolders: apiRes.data.total_folders || 0, files } });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { terabox };