const Booking = require('../models/Booking');

// @desc    Create a new service or trip booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { customerName, phone, email, type, price, details } = req.body;

    // Extract the data from the details object so it saves in the new columns
    const locationLink = details?.locationLink || null;
    const bikeNumber = details?.bikeNumber || null;
    const paymentMode = details?.paymentMode || null;
    const distanceKm = details?.distanceKm || null;
    const eta = details?.eta || null;
    const extraDetails = details?.extraDetails || null;

    const booking = await Booking.create({
      userId: req.user.id,
      customerName,
      phone,
      email,
      type,
      price,
      // Save directly to the new database columns
      locationLink,
      bikeNumber,
      paymentMode,
      distanceKm,
      eta,
      extraDetails,
      details // Keep backup of original JSON
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    if (req.user.role === 'user') {
      return res.status(403).json({ message: 'Not authorized to view all bookings' });
    }

    const bookings = await Booking.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'support') {
      return res.status(403).json({ success: false, message: 'Not authorized to update bookings' });
    }

    const booking = await Booking.findByPk(req.params.id); 
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = req.body.status || booking.status;
    
    if (req.user.role === 'admin' && req.body.price !== undefined) {
      booking.price = parseFloat(req.body.price);
    }

    if (req.body.details || req.body.status) {
      booking.details = { 
        ...booking.details, 
        ...req.body.details,
        statusUpdatedBy: req.user.name, 
        statusUpdatedAt: new Date().toISOString() 
      };
    }

    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating booking', error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete' });
    }

    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await booking.destroy();
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus, deleteBooking };