const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ pesan: "Akses ditolak! Anda harus login terlebih dahulu." });
    }

    try {
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next(); 
    } catch (error) {
        res.status(401).json({ pesan: "Token tidak valid atau sudah kadaluarsa!" });
    }
};