const credit = { creator: 'Mayza' };

const quotes = [
    { quote: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.", source: "QS. Al-Baqarah: 286" },
    { quote: "Maka sesungguhnya bersama kesulitan ada kemudahan.", source: "QS. Al-Insyirah: 5" },
    { quote: "Dan Dia mendapatimu sebagai seorang yang bingung, lalu Dia memberikan petunjuk.", source: "QS. Ad-Dhuha: 7" },
    { quote: "Maka ingatlah kepada-Ku, Aku pun akan ingat kepadamu.", source: "QS. Al-Baqarah: 152" },
    { quote: "Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan keperluannya.", source: "QS. At-Talaq: 3" },
    { quote: "Sebaik-baik kalian adalah yang paling baik akhlaknya.", source: "HR. Bukhari" },
    { quote: "Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata baik atau diam.", source: "HR. Bukhari" },
    { quote: "Janganlah kamu bersikap lemah, dan janganlah pula kamu bersedih hati.", source: "QS. Ali Imran: 139" },
    { quote: "Sesungguhnya Allah beserta orang-orang yang sabar.", source: "QS. Al-Baqarah: 153" },
    { quote: "Berdoalah kepada-Ku, niscaya akan Aku kabulkan bagimu.", source: "QS. Ghafir: 60" }
];

const quotesIslam = async (req, res) => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ ...credit, status: true, result: random });
};

module.exports = { quotesIslam };