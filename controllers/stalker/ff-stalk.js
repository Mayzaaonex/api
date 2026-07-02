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

const ffStalk = async (req, res) => {
    try {
        const uid = req.query.uid || '';
        if (!uid) {
            return res.json(removeKeysRecursive({ ...credit, status: false, message: 'Parameter uid diperlukan' }, ['creator', 'Creator', 'author', 'Author']));
        }

        const response = await axios.get('https://www.00cc.eu.cc/freefire-stalk', {
            params: { uid },
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36', 'Accept': 'application/json' },
            timeout: 15000
        });

        const raw = response.data;
        if (!raw.success) return res.json({ ...credit, status: false, message: 'UID tidak ditemukan' });

        const r = raw.result;
        let data = {
            ...credit,
            status: true,
            data: {
                basic: {
                    uid: r.account_basic_info?.uid,
                    name: r.account_basic_info?.name,
                    level: r.account_basic_info?.level,
                    exp: r.account_basic_info?.exp,
                    region: r.account_basic_info?.region,
                    likes: r.account_basic_info?.likes,
                    honor_score: r.account_basic_info?.honor_score,
                    title: r.account_basic_info?.title_name,
                    bio: r.account_basic_info?.bio,
                    has_elite_pass: r.account_basic_info?.has_elite_pass
                },
                activity: {
                    created_at: r.account_activity?.created_at,
                    last_login: r.account_activity?.last_login,
                    br_rank: r.account_activity?.br_rank,
                    cs_rank: r.account_activity?.cs_rank
                },
                social: {
                    gender: (r.social_info?.gender || '').replace('Gender_', ''),
                    language: (r.social_info?.language || '').replace('Language_', ''),
                    signature: r.social_info?.signature
                },
                overview: {
                    avatar: r.account_overview?.avatar_name,
                    banner: r.account_overview?.banner_name,
                    title: r.account_overview?.title_name
                },
                guild: {
                    name: r.guild_info?.guild_name,
                    id: r.guild_info?.guild_id,
                    level: r.guild_info?.guild_level,
                    members: r.guild_info?.live_members
                },
                misc: {
                    profile_image: r.profile_image
                }
            }
        };

        data = removeKeysRecursive(data, ['creator', 'Creator', 'author', 'Author']);
        res.json(data);

    } catch (error) {
        res.json(removeKeysRecursive({ ...credit, status: false, message: error.message }, ['creator', 'Creator', 'author', 'Author']));
    }
};

module.exports = { ffStalk };