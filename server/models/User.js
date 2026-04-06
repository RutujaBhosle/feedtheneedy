const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['restaurant','volunteer','ngo','individual'], required: true },
  phone:    { type: String, default: '' },
  area:     { type: String, default: '' },
  location: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
  },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

// Index for geo queries
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);