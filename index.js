const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const rateLimit = require("./middleware/ratelimit");
const {
    counter,
    getStats,
    blockIp,
    unblockIp,
} = require("./middleware/counter");
const { login, adminMiddleware } = require("./middleware/adminAuth");
const { analyzeFlood } = require("./flood-ai");
require("dotenv").config();

let lastAnalysis = 0;
const FLOOD_ANALYSIS_INTERVAL = 30000;

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", true);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(morgan("dev"));

// Counter
app.use("/api/", counter);

// Rate Limit with auto-block
rateLimit.setBlockIpFn(blockIp);
app.use("/api/", rateLimit);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Root - 404
app.get("/", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// ========== ADMIN LOGIN ==========
app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body || {};
    if (!password)
        return res.json({ success: false, message: "Password required" });
    const result = await login(password);
    res.json(result);
});

// ========== DASHBOARD STATS (RAHASIA - ADMIN) ==========
app.get("/api/nabatinextarbrownies/stats", adminMiddleware, (req, res) => {
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.json(getStats(false));
});

// ========== DASHBOARD STATS (PUBLIK) ==========
app.get("/api/dashboard/stats", (req, res) => {
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.json(getStats(true));
});

// ========== BLOCK IP ==========
app.post("/api/admin/block-ip", adminMiddleware, async (req, res) => {
    const { ip } = req.body || {};
    if (!ip) return res.json({ success: false, message: "IP required" });
    await blockIp(ip);
    res.json({ success: true, message: `IP ${ip} blocked` });
});

// ========== UNBLOCK IP ==========
app.post("/api/admin/unblock-ip", adminMiddleware, async (req, res) => {
    const { ip } = req.body || {};
    if (!ip) return res.json({ success: false, message: "IP required" });
    await unblockIp(ip);
    res.json({ success: true, message: `IP ${ip} unblocked` });
});

// ========== AI FLOOD ANALYSIS ==========
app.get("/api/flood/analyze", async (req, res) => {
    const now = Date.now();
    if (now - lastAnalysis < FLOOD_ANALYSIS_INTERVAL) {
        return res.json({ 
            analyzed: false, 
            message: "Menunggu analisis selanjutnya",
            nextIn: Math.floor((FLOOD_ANALYSIS_INTERVAL - (now - lastAnalysis)) / 1000) + " detik"
        });
    }
    
    const stats = getStats();
    const result = await analyzeFlood(stats.activities || [], stats.blockedIps || []);
    lastAnalysis = now;
    
    res.json({
        analyzed: true,
        timestamp: new Date().toISOString(),
        ...result
    });
});

// API Routes
app.use("/api/ai", require("./routes/ai"));
app.use("/api/ai-image", require("./routes/ai-image"));
app.use("/api/downloader", require("./routes/downloader"));
app.use("/api/game", require("./routes/game"));
app.use("/api/informasi", require("./routes/informasi"));
app.use("/api/maker", require("./routes/maker"));
app.use("/api/random", require("./routes/random"));
app.use("/api/search", require("./routes/search"));
app.use("/api/stalker", require("./routes/stalker"));
app.use("/api/tools", require("./routes/tools"));
app.use("/api/uploader", require("./routes/uploader"));

// ========== WHITELIST + DNS ERROR PAGE ==========
const WHITELIST = [
    '/', '/api/', '/js/', '/css/', '/fonts/',
    '/ai', '/ai-image', '/maker', '/downloader', '/game',
    '/informasi', '/random', '/search', '/stalker', '/tools',
    '/uploader', '/maker/brat', '/maker/fakengl', '/dashboard.html'
];

app.use((req, res, next) => {
    const reqPath = req.path.toLowerCase();
    const isWhitelisted = WHITELIST.some(p => reqPath.startsWith(p) || reqPath === p);
    
    if (isWhitelisted) return next();
    
    const ua = req.headers['user-agent'] || '';
    if (ua.includes('Mozilla') || ua.includes('Chrome') || ua.includes('Firefox')) {
        return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
    }
    res.status(404).end();
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});