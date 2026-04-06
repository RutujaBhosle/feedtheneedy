const express = require('express');
const Listing = require('../models/Listing');
const User = require('../models/User'); // ✅ required
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

// GET all listings (public)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ status: { $ne: 'expired' } })
      .populate('assignedVolunteer', 'name _id')
      .sort({ createdAt: -1 });

    let isVolunteer = false;
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        isVolunteer = decoded.role === 'volunteer';
      } catch (_) {}
    }

    const result = listings.map(l => {
      const obj = l.toObject();
      if (!isVolunteer) {
        delete obj.donorAddress;
        delete obj.donorPhone;
      }
      return obj;
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST create listing (restaurant only)
// POST new listing — notifies nearby volunteers
router.post('/', protect, restrictTo('restaurant'), async (req, res) => {
  try {
    const {
      foodType, description, portions,
      area, donorAddress, donorPhone,
      pickupBy, urgency,
      lat, lng, // restaurant coordinates
    } = req.body;

    const listing = await Listing.create({
      donor:        req.user._id,
      donorName:    req.user.name,
      donorPhone:   donorPhone || req.user.phone || '',
      donorAddress: donorAddress,
      foodType, description,
      portions, remaining: portions,
      area, pickupBy, urgency,
    });

    // ── Find nearby volunteers ──
    const User = require('../models/User');
    let nearbyVolunteers = [];

    if (lat && lng) {
      // Geo query — find volunteers within 10 km
      nearbyVolunteers = await User.find({
        role: 'volunteer',
        location: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(lng), parseFloat(lat)],
              10 / 6378.1, // 10 km in radians
            ]
          }
        }
      });
    } else {
      // Fallback — same area text match
      nearbyVolunteers = await User.find({
        role: 'volunteer',
        area: { $regex: area, $options: 'i' },
      });
    }

    // ── Send real-time notifications ──
    const io = req.app.get('io');
    const connectedVolunteers = req.app.get('connectedVolunteers');

    const notification = {
      type:        'new_listing',
      title:       '🍽️ New Food Available!',
      message:     `${req.user.name} posted ${portions} portions of ${foodType} in ${area}`,
      listingId:   listing._id,
      area,
      foodType,
      portions,
      urgency,
      createdAt:   new Date(),
    };

    let notified = 0;
    nearbyVolunteers.forEach(vol => {
      const socketId = connectedVolunteers[vol._id.toString()];
      if (socketId) {
        io.to(socketId).emit('new_listing_notification', notification);
        notified++;
      }
    });

    console.log(`📢 Notified ${notified}/${nearbyVolunteers.length} nearby volunteers`);

    res.status(201).json({
      listing,
      notified,
      nearbyVolunteers: nearbyVolunteers.length,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CLAIM listing (user)
router.patch('/:id/claim', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status !== 'active') return res.status(400).json({ message: 'Not available' });
    if (listing.remaining <= 0) return res.status(400).json({ message: 'No portions left' });

    listing.remaining -= 1;
    if (listing.remaining === 0) listing.status = 'claimed';

    await listing.save();

    res.json({ message: 'Food claimed!', listing });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ACCEPT listing (volunteer)
router.patch('/:id/accept', protect, restrictTo('volunteer'), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status !== 'active') return res.status(400).json({ message: 'Not available' });
    if (listing.assignedVolunteer) return res.status(400).json({ message: 'Already assigned' });

    listing.status = 'volunteer_assigned';
    listing.assignedVolunteer = req.user._id;

    await listing.save();
    await listing.populate('assignedVolunteer', 'name _id');

    res.json({ message: 'Pickup accepted!', listing });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// PICKUP complete
router.patch('/:id/pickup', protect, restrictTo('volunteer'), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.assignedVolunteer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your delivery' });
    }

    listing.status = 'picked_up';
    await listing.save();

    res.json({ message: 'Picked up!', listing });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE listing
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await listing.deleteOne();

    res.json({ message: 'Listing deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;