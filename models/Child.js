const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  nama: {
    type: String,
    required: true 
  },
  umur_bulan: {
    type: Number,
    required: true 
  },
  jenis_kelamin: {
    type: String,
    enum: ['Laki-laki', 'Perempuan'], 
    required: true
  },
  berat_badan_kg: {
    type: Number,
    required: true
  },
  tinggi_badan_cm: {
    type: Number,
    required: true
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Child', childSchema);