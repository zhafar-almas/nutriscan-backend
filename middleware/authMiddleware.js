const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    // 1. Cek apakah ada tiket (token) yang dibawa di bagian Header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ pesan: "Akses ditolak! Anda harus login terlebih dahulu." });
    }

    try {
        // 2. Ambil tokennya saja (membuang kata 'Bearer ')
        const token = authHeader.split(' ')[1];

        // 3. Verifikasi keaslian token menggunakan kunci rahasia dari .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Jika asli, simpan data user dan izinkan masuk ke tahap selanjutnya
        req.user = decoded;
        next(); 
    } catch (error) {
        res.status(401).json({ pesan: "Token tidak valid atau sudah kadaluarsa!" });
    }
};