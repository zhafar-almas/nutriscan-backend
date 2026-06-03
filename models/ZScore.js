const mongoose = require('mongoose');

const zscoreSchema = new mongoose.Schema({
  Umur_Bulan: { type: Number, required: true },
  Jenis_Kelamin: { type: String, required: true }, 
  SD3_Negatif: { type: Number, required: true },
  SD2_Negatif: { type: Number, required: true },
  Median: { type: Number, required: true },
  SD2_Positif: { type: Number, required: true },
  SD3_Positif: { type: Number, required: true }
});

module.exports = mongoose.model('ZScore', zscoreSchema, 'zscores');