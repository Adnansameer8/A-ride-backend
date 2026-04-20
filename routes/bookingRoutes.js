const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getMyBookings, 
  getAllBookings, 
  updateBookingStatus ,
  deleteBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking routes require the user to be logged in
// Create a new booking
router.post('/', protect, createBooking);

// Get bookings for the currently logged-in user
router.get('/my-bookings', protect, getMyBookings);

// Get all bookings (Admin/Support only)
router.get('/', protect, getAllBookings); 

// Update booking details or status (Admin/Support)
router.put('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

module.exports = router;