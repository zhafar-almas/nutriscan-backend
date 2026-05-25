const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
    // Menghubungkan data nutrisi dengan ID Anak tertentu
    childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child',
        required: true
    },
    nama_makanan: {
        type: String,
        required: true
    },
    kalori: {
        type: Number,
        required: true
    },
    karbohidrat_g: {
        type: Number,
        default: 0
    },
    protein_g: {
        type: Number,
        default: 0
    },
    lemak_g: {
        type: Number,
        default: 0
    },
    tanggal_pencatatan: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Nutrition', nutritionSchema);