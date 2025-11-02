const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true }, // lost or found
  location: { type: String, required: true },
  locationCoords: { type: [Number], required: true }, // [lat, lng]
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  reward: { type: Number },
  imageUrl: { type: String },
  status: { type: String, default: 'active' },
  dateReported: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', itemSchema);
