const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  donor:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorName:         { type: String, required: true },
  donorAddress:      { type: String, default: '' },
  donorPhone:        { type: String, default: '' },
  foodType:          { type: String, required: true },
  description:       { type: String },
  portions:          { type: Number, required: true },
  remaining:         { type: Number },
  area:              { type: String, required: true },
  pickupBy:          { type: String, required: true },
  urgency:           { type: String, enum: ['urgent','today','fresh'], default: 'fresh' },
  status:            { type: String, enum: ['active','claimed','volunteer_assigned','picked_up','delivered','expired'], default: 'active' },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);