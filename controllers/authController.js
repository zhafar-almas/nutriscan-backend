const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        // 1. Cek apakah email sudah pernah didaftarkan
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ pesan: "Email sudah terdaftar!" });
        }

        // 2. Acak/sandikan password menggunakan bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Buat dan simpan akun baru ke database
        const newUser = new User({
            nama,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ sukses: true, pesan: "Akun berhasil dibuat!" });

    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Cek apakah email terdaftar di database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ pesan: "Email tidak ditemukan!" });
        }

        // 2. Cocokkan password yang diketik dengan password yang dienkripsi
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ pesan: "Password salah!" });
        }

        // 3. Buat "tiket masuk" (Token JWT)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d' // Tiket akan hangus dalam 1 hari
        });

        // 4. Kirim response sukses berserta token dan userId
        res.status(200).json({ 
            sukses: true, 
            pesan: "Login berhasil!", 
            token: token,
            userId: user._id // <--- INI TAMBAHANNYA
        });

    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};
// Pancingan untuk Vercel