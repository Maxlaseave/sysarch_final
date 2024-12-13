const logger = require('../utils/logger');

// In-memory support tickets storage (replace with database in production)
const tickets = [
  { 
    id: '1', 
    customer: 'Acme Corp', 
    status: 'Open', 
    priority: 'High',
    description: 'Delivery issue with recent order',
    assignedTo: null
  },
  { 
    id: '2', 
    customer: 'Tech Innovations', 
    status: 'In Progress', 
    priority: 'Medium',
    description: 'Software integration problem',
    assignedTo: 'support_agent_1'
  }
];

const getAllTickets = (req, res) => {
  try {
    logger.info('Fetching all support tickets');
    res.json(tickets);
  } catch (error) {
    logger.error(`Error fetching tickets: ${error.message}`);
    res.status(500).json({ message: 'Error fetching tickets' });
  }
};

const createTicket = (req, res) => {
  const { customer, description, priority } = req.body;

  try {
    // Validate input
    if (!customer || !description) {
      return res.status(400).json({ message: 'Customer and description are required' });
    }

    const newTicket = {
      id: (tickets.length + 1).toString(),
      customer,
      description,
      status: 'Open',
      priority: priority || 'Low',
      assignedTo: null,
      createdAt: new Date().toISOString()
    };

    tickets.push(newTicket);

    logger.info(`Support ticket created for ${customer}`);
    res.status(201).json(newTicket);
  } catch (error) {
    logger.error(`Error creating support ticket: ${error.message}`);
    res.status(500).json({ message: 'Error creating support ticket' });
  }
};

const updateTicketStatus = (req, res) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body;

  try {
    const ticketIndex = tickets.findIndex(t => t.id === id);

    if (ticketIndex === -1) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Update ticket
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...(status && { status }),
      ...(assignedTo && { assignedTo })
    };

    logger.info(`Ticket status updated: ${id}`);
    res.json(tickets[ticketIndex]);
  } catch (error) {
    logger.error(`Error updating ticket status: ${error.message}`);
    res.status(500).json({ message: 'Error updating ticket status' });
  }
};

module.exports = { 
  getAllTickets, 
  createTicket, 
  updateTicketStatus,
  tickets 
};