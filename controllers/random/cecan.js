const axios = require('axios');
const credit = { creator: 'Mayza' };

const images = {
    thailand: [
        'https://i.pinimg.com/originals/f8/35/49/f83549c84b798f5ed761369437b5f804.jpg',
        'https://i.pinimg.com/originals/0f/91/fb/0f91fb2a6e45f4cbb686808dc26c8894.jpg',
        'https://i.pinimg.com/originals/32/a1/05/32a1055e8d460c55241cbacc0ad0f19b.jpg',
        'https://i.pinimg.com/originals/ed/3f/22/ed3f22f0cba1039f65aef4ec4a5bf3e3.png',
        'https://i.pinimg.com/originals/e1/31/bf/e131bf2d8de85605ea649ee66cdf6099.jpg'
    ],
    indonesia: [
        'https://i.pinimg.com/originals/46/74/fe/4674fe767ff7666289e720025246734f.jpg',
        'https://i.pinimg.com/originals/39/a2/94/39a29415fa150b8e3448723d542a9b58.jpg',
        'https://i.pinimg.com/originals/18/20/fe/1820feab2c38fa8fb5a3c506804f876a.jpg'
    ],
    malaysia: [
        'https://i.pinimg.com/originals/ac/87/e5/ac87e5af7343ac0d5bedffbdd7a28185.png',
        'https://i.pinimg.com/originals/d4/44/fe/d444fe6bacb480219d34f0ccfd7f4b47.jpg'
    ],
    vietnam: [
        'https://i.pinimg.com/originals/a4/b6/47/a4b64751bd605d0f2d91856603b95c06.jpg',
        'https://i.pinimg.com/originals/b2/03/6a/b2036a7bde6e81c07fc7b79c11fc6f1f.jpg'
    ],
    japan: [
        'https://i.pinimg.com/originals/85/ac/71/85ac713abb983adc152344dcd041e565.jpg',
        'https://i.pinimg.com/originals/42/d8/c8/42d8c8b8a658ddd8779bc8f6100c2120.jpg'
    ],
    china: [
        'https://i.pinimg.com/originals/59/f7/61/59f76117bb98955e1ec56f6d77ec7b69.jpg',
        'https://i.pinimg.com/originals/c2/cd/ff/c2cdff162acc7eded8ec452f635f3eb8.jpg'
    ],
    korea: [
        'https://i.pinimg.com/originals/73/85/d6/7385d60c7a168fd851ee08ee6eb3cb76.png',
        'https://i.pinimg.com/originals/4e/cc/4b/4ecc4b5c3ced19af57cc47a228aaf531.png'
    ]
};

const cecan = async (req, res) => {
    try {
        const country = req.query.country || 'thailand';
        if (!images[country]) return res.json({ ...credit, status: false, message: 'Negara tidak valid' });

        const list = images[country];
        const randomImage = list[Math.floor(Math.random() * list.length)];

        const response = await axios.get(randomImage, { responseType: 'arraybuffer', timeout: 10000 });
        res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
        res.send(response.data);

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { cecan };