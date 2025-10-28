const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  department: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
