const Ticket = require('../models/Ticket');

// @desc    Create a new ticket (User side)
const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      conversation: [{
        sender: 'user',
        text: req.body.message,
        timestamp: new Date().toISOString()
      }]
    });
    res.status(201).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's own tickets (User side history)
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({ 
      where: { email: req.user.email },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// @desc    Get all tickets (Staff side queue)
const getAllTickets = async (req, res) => {
  try {
    if (req.user.role === 'user') return res.status(403).json({ success: false });
    const tickets = await Ticket.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// @desc    Staff reply/Resolve to ticket (TicketManagement.jsx)
const resolveTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ success: false });

    const { reply, attachment, image, status } = req.body; 

    if (reply || attachment || image) {
      const newMessage = { 
        sender: 'staff', 
        text: reply || '', 
        attachment: attachment || null, 
        image: image || null, // Keeping image just for backwards compatibility
        timestamp: new Date().toISOString(), 
        staffName: req.user.name 
      };
      ticket.conversation = [...(ticket.conversation || []), newMessage];
    }

    ticket.status = status || ticket.status;
    if (status === 'closed') {
      ticket.resolvedBy = req.user.name;
    }
    
    await ticket.save();
    res.json({ success: true, ticket });
  } catch (error) {
    console.error("Error resolving ticket:", error);
    res.status(500).json({ success: false });
  }
};

// @desc    User replies back to staff (Support.jsx)
const userReplyToTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket || ticket.email !== req.user.email) return res.status(403).json({ success: false });

    const { reply, attachment, image } = req.body;

    const newMessage = { 
      sender: 'user', 
      text: reply || '',      
      attachment: attachment || null, 
      image: image || null,
      timestamp: new Date().toISOString() 
    };

    ticket.conversation = [...(ticket.conversation || []), newMessage];
    ticket.status = 'open'; 
    
    await ticket.save();
    res.json({ success: true, ticket });
  } catch (error) {
    console.error("Error replying to ticket:", error);
    res.status(500).json({ success: false });
  }
};
// ... existing functions (createTicket, getMyTickets, getAllTickets, resolveTicket, userReplyToTicket)

// ── NEW: Delete Ticket (Admin/Staff side) ──
const deleteTicket = async (req, res) => {
  try {
    // Prevent standard users from deleting tickets
    if (req.user.role === 'user') return res.status(403).json({ success: false, message: 'Not authorized' });
    
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    await ticket.destroy();
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { 
  createTicket, 
  getMyTickets, 
  getAllTickets, 
  resolveTicket, 
  userReplyToTicket,
  deleteTicket 
};