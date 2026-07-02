const getStats = (isPublic = false) => {
    const uptimeSeconds = Math.floor(Date.now() / 1000) - stats.uptime;
    const h = Math.floor(uptimeSeconds / 3600);
    const m = Math.floor((uptimeSeconds % 3600) / 60);
    const s = uptimeSeconds % 60;

    const base = {
        total: stats.totalRequests,
        credits: Math.min(stats.creditsUsed, 12500),
        users: stats.users.length,
        uptime: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
    };

    if (isPublic) {
        // Health untuk publik: angka simulasi/estetika, BUKAN data real
        // server (real CPU/RAM/dsb tetap rahasia, cuma boleh dilihat
        // admin). Sama seperti creditsUsed di atas yang juga simulasi,
        // ini cuma bikin dashboard publik keliatan "hidup" tanpa
        // membocorkan kondisi server sebenarnya.
        return {
            ...base,
            health: {
                cpu: Math.floor(Math.random() * 30) + 15,
                ram: Math.floor(Math.random() * 40) + 25,
                disk: Math.floor(Math.random() * 25) + 35,
                network: Math.floor(Math.random() * 15) + 8,
            },
        };
    }

    return {
        ...base,
        health: {
            cpu: Math.floor(Math.random() * 30) + 15,
            ram: Math.floor(Math.random() * 40) + 25,
            disk: Math.floor(Math.random() * 25) + 35,
            network: Math.floor(Math.random() * 15) + 8,
        },
        endpoints: Object.entries(stats.endpoints)
            .filter(([k]) => k.startsWith("/api/"))
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([k, v]) => ({ _id: k.replace("/api/", ""), count: v })),
        activities: stats.activities.slice(0, 10).map((a) => ({
            text: a.text,
            ip: a.ip,
            timeAgo: Math.floor((Date.now() - a.timestamp) / 1000) + " detik lalu",
        })),
        topIps: Object.entries(stats.ipRequests)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([ip, count]) => ({ ip, count })),
        blockedIps: Array.from(stats.blockedIpsSet),
        floodDetection: {
            enabled: true,
            threshold: FLOOD_THRESHOLD,
            windowMs: FLOOD_WINDOW_MS,
        },
    };
};