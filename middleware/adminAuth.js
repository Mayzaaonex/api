const bcrypt = require('bcryptjs');
require('dotenv').config();

// ========== ADMIN CONFIG ==========
// Prioritas: env var ADMIN_PASSWORD (plaintext) atau ADMIN_HASH (bcrypt hash)
const JWT_TOKENS = new Set();

// ========== LOGIN ==========
async function login(password) {
    let match = false;

    if (process.env.ADMIN_HASH) {
        // Pakai hash dari env var
        match = await bcrypt.compare(password, process.env.ADMIN_HASH);
    } else if (process.env.ADMIN_PASSWORD) {
        // Pakai plaintext dari env var (auto-compare)
        match = password === process.env.ADMIN_PASSWORD;
    } else {
        // Tidak ada kredensial admin dikonfigurasi - JANGAN login siapapun.
        // Fallback hash hardcoded sebelumnya adalah celah keamanan serius
        // karena hash-nya nempel di source code (bisa di-brute-force offline
        // kalau repo bocor/public). Admin wajib set ADMIN_HASH atau
        // ADMIN_PASSWORD di environment variable.
        console.error('[Auth] ADMIN_HASH / ADMIN_PASSWORD belum di-set di environment!');
        return { success: false, message: 'Admin belum dikonfigurasi. Hubungi pemilik server.' };
    }

    if (match) {
        const token = require('crypto').randomBytes(32).toString('hex');
        JWT_TOKENS.add(token);
        setTimeout(() => JWT_TOKENS.delete(token), 86400000); // expire 24 jam
        return { success: true, token };
    }
    return { success: false, message: 'Password salah!' };
}

// ========== CEK TOKEN VALID (dipakai middleware lain, mis. rate limiter) ==========
// Token HANYA diterima lewat header x-admin-token, bukan query string,
// karena query string gampang kebawa access log / referrer header / browser history.
function isValidToken(token) {
    return !!token && JWT_TOKENS.has(token);
}

// ========== MIDDLEWARE ==========
function adminMiddleware(req, res, next) {
    const token = req.headers['x-admin-token'] || '';
    if (isValidToken(token)) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// ========== GENERATE HASH (helper, jalanin manual kalau perlu) ==========
async function generateHash(password) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    console.log('HASH:', hash);
    return hash;
}

module.exports = { login, adminMiddleware, generateHash, isValidToken };
