const credit = { creator: 'Mayza' };

const matematika = async (req, res) => {
    try {
        const level = req.query.level || 'easy';

        const modes = {
            noob: [-3, 3, -3, 3, '+-', 15000, 10],
            easy: [-10, 10, -10, 10, '*/+-', 20000, 40],
            medium: [-40, 40, -20, 20, '*/+-', 40000, 150],
            hard: [-100, 100, -70, 70, '*/+-', 60000, 350],
            extreme: [-999999, 999999, -999999, 999999, '*/', 99999, 9999]
        };

        if (!modes[level]) {
            return res.json({ ...credit, status: false, message: 'Level tidak valid' });
        }

        const m = modes[level];
        let a = Math.floor(Math.random() * (m[1] - m[0] + 1)) + m[0];
        let b = Math.floor(Math.random() * (m[3] - m[2] + 1)) + m[2];
        const ops = m[4].split('');
        const op = ops[Math.floor(Math.random() * ops.length)];

        const opMap = { '+': '+', '-': '-', '*': '×', '/': '÷' };

        if (op === '/') {
            while (b === 0) b = Math.floor(Math.random() * (m[3] - m[2] + 1)) + m[2];
            a = a * b;
        }

        let result;
        switch (op) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': result = a / b; break;
        }

        res.json({
            ...credit,
            status: true,
            result: {
                str: `${a} ${opMap[op]} ${b}`,
                mode: level,
                time: m[5],
                bonus: m[6],
                result: result
            }
        });

    } catch (error) {
        res.json({ ...credit, status: false, message: error.message });
    }
};

module.exports = { matematika };