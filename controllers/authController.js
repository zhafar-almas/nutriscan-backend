const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ pesan: "Email sudah terdaftar!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ pesan: "Email tidak ditemukan!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ pesan: "Password salah!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d' 
        });

        res.status(200).json({ 
            sukses: true, 
            pesan: "Login berhasil!", 
            token: token,
            userId: user._id 
        });

    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};
