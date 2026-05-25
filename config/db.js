const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mencoba terhubung ke MongoDB menggunakan alamat dari file .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Berhasil Terhubung: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error Koneksi MongoDB: ${error.message}`);
    process.exit(1); // Menghentikan server jika gagal terhubung
  }
};

module.exports = connectDB;