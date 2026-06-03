const mongoose = require('mongoose');

const growthSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  usia_bulan: { type: Number, required: true },
  tinggi_badan_cm: { type: Number, required: true },
  berat_badan_kg: { type: Number, required: true },
  status_gizi: { type: String, default: 'Belum dihitung' } 
}, { timestamps: true });

module.exports = mongoose.model('Growth', growthSchema);