const axios = require('axios');

const API_URL = 'https://rputk8a.abc-tunnel.us/v1/chat/completions';
const API_KEY = 'sk-0a798f2170408475-6vo8nv-ab9e280a';
const MODEL = 'oc/mimo-v2.5-free';

async function analyzeFlood(activities, blockedIps) {
    // Format data untuk AI
    const activityList = activities.map(a => `- ${a.text} from ${a.ip} (${a.timeAgo})`).join('\n');
    
    const prompt = `Anda adalah sistem deteksi flood/DDoS. Analisa aktivitas berikut:

${activityList}

IP yang sudah diblokir: ${blockedIps.join(', ') || 'Tidak ada'}

Tugas:
1. Deteksi apakah ada pola mencurigakan (banyak request ke endpoint sama dari IP berbeda dalam waktu singkat)
2. Kalau suspect flood, jawab dengan format: "SUSPECT: <ip1>,<ip2>,<ip3> - <alasan>"
3. Kalau normal, jawab: "NORMAL"

Contoh suspect: "SUSPECT: 1.2.3.4,5.6.7.8 - 10 request ke /stalker/roblox dalam 30 detik"`;

    try {
        const response = await axios.post(API_URL, {
            model: MODEL,
            messages: [
                { role: "system", content: "Anda adalah expert cyber security. Deteksi flood attack." },
                { role: "user", content: prompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });

        const result = response.data?.choices?.[0]?.message?.content || '';
        console.log('🤖 AI Analysis:', result.substring(0, 100));
        
        // Parse result
        if (result.startsWith('SUSPECT:')) {
            const match = result.match(/SUSPECT: ([0-9., ]+)/);
            if (match) {
                const ips = match[1].split(',').map(ip => ip.trim()).filter(ip => ip);
                return { suspect: true, ips, reason: result };
            }
        }
        
        return { suspect: false, ips: [], reason: result };
    } catch (e) {
        console.error('AI Analysis Error:', e.message);
        return { suspect: false, ips: [], reason: 'Error' };
    }
}

module.exports = { analyzeFlood };