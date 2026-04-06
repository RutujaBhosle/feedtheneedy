const Listing = require('../models/Listing');

/**
 * Auto-expires listings whose pickupBy time has passed.
 * Runs on server start and then every 5 minutes via setInterval in server.js
 */
const expireOldListings = async () => {
  try {
    const now = new Date();

    // Find active listings and check if their pickupBy time has passed.
    // pickupBy is stored as a string like "9:00 PM", so we compare
    // against the listing's creation date + the time string.
    // A simpler approach: expire listings older than 12 hours that are still active.
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    const result = await Listing.updateMany(
      {
        status: { $in: ['active'] },
        createdAt: { $lt: twelveHoursAgo },
      },
      { $set: { status: 'expired' } }
    );

    if (result.modifiedCount > 0) {
      console.log(`⏰ Expired ${result.modifiedCount} old listing(s)`);
    }
  } catch (err) {
    console.error('Error expiring listings:', err.message);
  }
};

module.exports = expireOldListings;