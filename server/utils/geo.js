function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function toRad(deg) { return (deg * Math.PI) / 180 }

function getNearbySocketIds(onlineVolunteers, listingLat, listingLng, radiusKm = 10) {
  const nearby = []
  for (const [, data] of onlineVolunteers.entries()) {
    if (data.lat && data.lng) {
      const dist = haversineKm(listingLat, listingLng, data.lat, data.lng)
      if (dist <= radiusKm) nearby.push(data.socketId)
    }
  }
  return nearby
}

module.exports = { haversineKm, getNearbySocketIds }