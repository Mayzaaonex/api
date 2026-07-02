const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'stats.json');

function loadDB() {
    try {
        if (fs.existsSync(DB_FILE)) {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('[DB] Gagal load stats.json:', e.message);
    }
    return {
        totalRequests: 0,
        creditsUsed: 0,
        uptime: Math.floor(Date.now() / 1000),
        users: [],
        endpoints: {},
        activities: [],
        ipRequests: {},
        blockedIps: [],
    };
}

function saveDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('[DB] Gagal save stats.json:', e.message);
    }
}

const stats = loadDB();
stats.blockedIpsSet = new Set(stats.blockedIps || []);
stats.loaded = true;

console.log('[DB] Stats loaded dari stats.json (local)');

const endpointIpTracker = {};
const FLOOD_THRESHOLD = 3;
const FLOOD_WINDOW_MS = 30000;

const checkFlood = (endpoint, ip) => {
    const now = Date.now();
    if (!endpointIpTracker[endpoint]) {
        endpointIpTracker[endpoint] = { ips: [], timestamp: now };
    }
    
    const tracker = endpointIpTracker[endpoint];
    
    if (now - tracker.timestamp > FLOOD_WINDOW_MS) {
        tracker.ips = [];
        tracker.timestamp = now;
    }
    
    if (!tracker.ips.includes(ip)) {
        tracker.ips.push(ip);
    }
    
    if (tracker.ips.length >= FLOOD_THRESHOLD) {
        const flooders = [...tracker.ips];
        tracker.ips = [];
        tracker.timestamp = now;
        return flooders;
    }
    
    return null;
};

const blockIpInternal = async (ip) => {
    stats.blockedIpsSet.add(ip);
    stats.blockedIps = Array.from(stats.blockedIpsSet);
    saveDB(stats);
    console.log(`[FLOOD] Blocked IP ${ip}`);
};

const ADMIN_PATHS = [
    "/admin/login",
    "/admin/block-ip",
    "/admin/unblock-ip",
    "/dashboard/stats",
    "/nabatinextarbrownies",
];

const INTERNAL_PATHS = [
    "/request", "/stats", "/admin", "/logs", "/credits", "/flood/analyze",
];

const getRealIp = (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) return forwarded.split(",")[0].trim();
    const realIp = req.headers["x-real-ip"];
    if (realIp) return realIp.trim();
    const raw = req.ip || req.connection?.remoteAddress || "unknown";
    return raw.replace(/^::ffff:/, "");
};

const counter = (req, res, next) => {
    const ip = getRealIp(req);
    const endpoint = req.path.replace(/\/$/, "") || "/";
    const isAdminEndpoint = ADMIN_PATHS.some((p) => endpoint.includes(p));

    if (!isAdminEndpoint && stats.blockedIpsSet.has(ip)) {
        return res.status(403).json({ error: "IP blocked" });
    }

    if (!isAdminEndpoint) {
        const flooders = checkFlood(endpoint, ip);
        if (flooders) {
            for (const floater of flooders) {
                blockIpInternal(floater);
            }
        }

        if (ip !== "unknown") {
            if (!stats.users.includes(ip)) stats.users.push(ip);
            stats.ipRequests[ip] = (stats.ipRequests[ip] || 0) + 1;
        }

        stats.totalRequests++;
        stats.creditsUsed += Math.floor(Math.random() * 5) + 1;
        if (stats.creditsUsed > 12500) stats.creditsUsed = stats.creditsUsed % 12500;

        stats.endpoints[endpoint] = (stats.endpoints[endpoint] || 0) + 1;

        const isInternalEndpoint = INTERNAL_PATHS.some(p => endpoint === p);
        if (!isInternalEndpoint) {
            stats.activities.unshift({
                text: `${req.method} ${endpoint}`,
                ip: ip,
                timestamp: Date.now(),
            });
            if (stats.activities.length > 20) stats.activities.pop();
        }

        if (stats.totalRequests % 10 === 0) {
            saveDB(stats);
        }
    }

    next();
};

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

    if (isPublic) return base;

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

const blockIp = async (ip) => {
    stats.blockedIpsSet.add(ip);
    stats.blockedIps = Array.from(stats.blockedIpsSet);
    saveDB(stats);
};

const unblockIp = async (ip) => {
    stats.blockedIpsSet.delete(ip);
    stats.blockedIps = Array.from(stats.blockedIpsSet);
    saveDB(stats);
};

// Save on exit
process.on('SIGINT', () => { saveDB(stats); process.exit(); });
process.on('SIGTERM', () => { saveDB(stats); process.exit(); });

module.exports = { counter, getStats, blockIp, unblockIp, blockIpInternal };