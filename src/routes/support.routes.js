// File: src/routes/support.routes.js
const express = require('express');
const router = express.Router();
const { 
  getAllTickets, 
  createTicket, 
  updateTicketStatus 
} = require('../services/support.service');
const { checkRole } = require('../middleware/auth.middleware');

router.get('/tickets', checkRole(['admin', 'support']), getAllTickets);
router.post('/tickets', checkRole(['admin', 'support']), createTicket);
router.put('/tickets/:id', checkRole(['admin', 'support']), updateTicketStatus);

module.exports = router;