const rateLimit = require("express-rate-limit");
const { isValidToken } = require("./adminAuth");

const ADMIN_SECRET_PATH = "/api/nabatinextarbrownies";

let blockIpFn = null;
let rateLimitHits = {};

module.exports = {
    setBlockIpFn: (fn) => { blockIpFn = fn; },
    getRateLimitHits: () => rateLimitHits,
    resetRateLimitHits: (ip) => { delete rateLimitHits[ip]; },
};

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    skip: (req) => {
        // PENTING: dulu di sini cuma cek header x-admin-token ADA atau
        // tidak (tanpa validasi isinya) -> siapapun bisa bypass rate
        // limit cuma dengan kirim header itu isi apa aja. Sekarang
        // token beneran divalidasi ke daftar token admin yang valid.
        const token = req.headers["x-admin-token"] || "";
        return (
            isValidToken(token) ||
            req.path === "/"
        );
    },
    handler: (req, res, next, options) => {
        const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() 
            || req.headers["x-real-ip"]?.trim() 
            || req.ip?.replace(/^::ffff:/, "") 
            || "unknown";
        
        rateLimitHits[ip] = (rateLimitHits[ip] || 0) + 1;
        
        if (rateLimitHits[ip] >= 4 && blockIpFn) {
            blockIpFn(ip);
            delete rateLimitHits[ip];
            return res.status(403).json({ error: "IP blocked due to rate limit abuse" });
        }
        
        res.status(options.statusCode).json(options.message);
    },
    message: {
        status: false,
        creator: "Mayzaa",
        message: "Too many requests",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

limiter.setBlockIpFn = module.exports.setBlockIpFn;
limiter.getRateLimitHits = module.exports.getRateLimitHits;
limiter.resetRateLimitHits = module.exports.resetRateLimitHits;

module.exports = limiter;