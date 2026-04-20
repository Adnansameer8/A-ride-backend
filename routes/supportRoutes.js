const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { 
  createTicket, 
  getMyTickets, 
  getAllTickets, 
  resolveTicket, 
  userReplyToTicket,
  deleteTicket
} = require('../controllers/supportController');

// ── USER ROUTES ──
// Path: POST /api/support/tickets/
router.post('/', protect, createTicket);               

// Path: GET /api/support/tickets/my
router.get('/my', protect, getMyTickets);              

// Path: PUT /api/support/tickets/:id/user-reply
router.put('/:id/user-reply', protect, userReplyToTicket); 


// ── STAFF/ADMIN ROUTES ──
// Path: GET /api/support/tickets/all   <-- THIS FIXES YOUR 404 ERROR!
router.get('/all', protect, getAllTickets);               

// Path: PUT /api/support/tickets/:id/reply
router.put('/:id/reply', protect, resolveTicket);    

// Path: DELETE /api/support/tickets/:id  <-- THIS FIXES THE DELETE BUTTON!
router.delete('/:id', protect, deleteTicket);

module.exports = router;