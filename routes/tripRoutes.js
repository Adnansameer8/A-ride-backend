const express = require('express');
const router = express.Router();
const { getApprovedTrips, getAllTrips, upsertTrip, updateTrip, deleteTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.get('/approved', getApprovedTrips); // Public access
router.get('/', protect, getAllTrips);      // Protected access
router.post('/', protect, upsertTrip);     // Create or Update
router.put('/:id', protect, updateTrip);    // Direct update
router.delete('/:id', protect, deleteTrip);
module.exports = router;