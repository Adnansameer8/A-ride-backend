const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getServicesConfig,
  updateServicesConfig,
  getServicesSettings,
  updateServicesSettings,
} = require('../controllers/servicesController');

// Public — frontend loads these without auth
router.get('/config',   getServicesConfig);
router.get('/settings', getServicesSettings);

// Admin only — ServicesManagement page writes to these
router.put('/config',   protect, admin, updateServicesConfig);
router.put('/settings', protect, admin, updateServicesSettings);

module.exports = router;