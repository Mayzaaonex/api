const axios = require("axios");

const CORS_PROXY = "https://cors.rifkyshre.biz.id/";
const FIREBASE_KEY = "AIzaSyAhX7hgWsGjY-Lo6eqwJmuRU2xxNRTY7kQ";

function hex(bytes) {
    let s = "";
    for (let i = 0; i < bytes; i++) {
        s += Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0");
    }
    return s;
}

function uuid() {
    const h = hex(16);
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

async function firebaseSignup() {
    const user = "u" + Date.now() + hex(3);
    const email = `${user}@gienetic.com`;
    const password = "Pwd" + hex(8) + "@#";

    const res = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_KEY}`,
        { returnSecureToken: true, email, password },
        {
            timeout: 30000,
            validateStatus: () => true,
            headers: {
                "Content-Type": "application/json",
                Origin: "https://quillbot.com",
                Referer: "https://quillbot.com/",
            },
        },
    );

    if (res.status !== 200 || !res.data?.idToken) {
        throw new Error(`Firebase signup gagal: HTTP ${res.status}`);
    }

    return { idToken: res.data.idToken, email };
}

async function warmupCookies() {
    try {
        const res = await axios.get(`${CORS_PROXY}https://quillbot.com/`, {
            timeout: 15000,
            validateStatus: () => true,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
            },
        });
        const setCookies = res.headers?.["set-cookie"] ?? [];
        return setCookies.map((c) => c.split(";")[0]).join("; ");
    } catch {
        return "";
    }
}

const quillbotImage = async (req, res) => {
    try {
        const prompt = req.query.text || req.body.text || "";
        if (!prompt)
            return res.json({
                creator: "Mayza",
                status: false,
                message: "Parameter text diperlukan",
            });

        const category = req.query.category || req.body.category || "Auto";
        const aspectRatio =
            req.query.aspectRatio || req.body.aspectRatio || "1:1";

        // 1. Auto-signup Firebase
        const account = await firebaseSignup();

        // 2. Warmup cookies
        const cookie = await warmupCookies();

        // 3. Generate image
        const traceId = hex(16);
        const spanId = hex(8);

        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json, text/plain, */*",
            "platform-type": "webapp",
            "qb-product": "IMAGE-GENERATOR",
            useridtoken: account.idToken,
            "webapp-version": "42.51.6",
            Origin: "https://quillbot.com",
            Referer: `https://quillbot.com/ai-image-generator/i/${uuid()}`,
            "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
            baggage: `sentry-environment=prod,sentry-release=v42.51.6,sentry-public_key=5743ef12f4887fc460c7968ebb2de54d,sentry-trace_id=${traceId},sentry-sampled=false`,
            "sentry-trace": `${traceId}-${spanId}-0`,
        };
        if (cookie) headers.Cookie = cookie;

        const genRes = await axios.post(
            `${CORS_PROXY}https://quillbot.com/api/raven/generate/image`,
            { prompt, category, aspectRatio, promptId: "image/generate-image" },
            { timeout: 120000, validateStatus: () => true, headers },
        );

        // 201 = Created (sukses juga!)
        if (genRes.status === 429) {
            return res.json({
                creator: "Mayza",
                status: false,
                message: "Rate limit QuillBot, coba lagi nanti",
            });
        }
        if (genRes.status === 401 || genRes.status === 403) {
            return res.json({
                creator: "Mayza",
                status: false,
                message: "Auth gagal",
            });
        }
        if (genRes.status < 200 || genRes.status >= 300) {
            return res.json({
                creator: "Mayza",
                status: false,
                message: `HTTP ${genRes.status}: Gagal generate`,
            });
        }

        const images = Array.isArray(genRes.data?.data?.images)
            ? genRes.data.data.images
            : [];
        const urls = images.map((v) => v.downloadUrl).filter(Boolean);

        if (urls.length === 0) {
            return res.json({
                creator: "Mayza",
                status: false,
                message: "Gagal generate gambar",
            });
        }

        res.json({
            creator: "Mayza",
            status: true,
            result: {
                prompt,
                category,
                aspectRatio,
                imageCount: urls.length,
                images: urls,
                firstImage: urls[0],
            },
        });
    } catch (error) {
        res.json({ creator: "Mayza", status: false, message: error.message });
    }
};

module.exports = { quillbotImage };
