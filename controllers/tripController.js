const Trip = require('../models/Trip');

// @desc    Get all approved trips for public users
// @route   GET /api/trips/approved
const getApprovedTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({ where: { status: 'approved' } });
    res.json({ success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching trips', error: error.message });
  }
};

// @desc    Get all trips (Admin/Support only)
// @route   GET /api/trips
const getAllTrips = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'support') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const trips = await Trip.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching trips', error: error.message });
  }
};

// @desc    Create or Update a trip (Admin/Support)
// @route   POST /api/trips
const upsertTrip = async (req, res) => {
  try {
    const { id, ...tripData } = req.body;
    
    // Ensure the user info exists from the 'protect' middleware
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User session expired. Please login again.' });
    }

    // UPDATE: If ID exists and is a valid UUID format
    if (id && id.includes('-')) { 
      const trip = await Trip.findByPk(id);
      if (!trip) return res.status(404).json({ success: false, message: 'Trip not found in database.' });
      
      await trip.update({ 
        ...tripData, 
        // Admins auto-approve their own edits; support stays pending
        status: req.user.role === 'admin' ? 'approved' : 'pending' 
      });
      return res.json({ success: true, trip });
    }

    // CREATE: New Trip
    const trip = await Trip.create({ 
      ...tripData, 
      status: req.user.role === 'admin' ? 'approved' : 'pending',
      createdBy: req.user.email || 'Admin'
    });

    res.status(201).json({ success: true, trip });
  } catch (error) {
    console.error("Upsert Error:", error);
    res.status(500).json({ success: false, message: 'Database Error', error: error.message });
  }
};

// @desc    Update only trip status or specifics
// @route   PUT /api/trips/:id
const updateTrip = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Not authorized' });
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    await trip.update(req.body);
    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating trip', error: error.message });
  }
};
// @desc    Delete a trip
// @route   DELETE /api/trips/:id
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await trip.destroy(); // Removes the trip from the database
    res.json({ success: true, message: 'Trip deleted successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { getApprovedTrips, getAllTrips, upsertTrip, updateTrip , deleteTrip};