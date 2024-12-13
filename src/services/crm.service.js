const logger = require('../utils/logger');

// In-memory customer storage (replace with database in production)
const customers = [
  { id: '1', name: 'Acme Corp', contact: 'John Doe', email: 'john@acme.com' },
  { id: '2', name: 'Tech Innovations', contact: 'Jane Smith', email: 'jane@techinnovations.com' }
];

const getAllCustomers = (req, res) => {
  try {
    logger.info('Fetching all customers');
    res.json(customers);
  } catch (error) {
    logger.error(`Error fetching customers: ${error.message}`);
    res.status(500).json({ message: 'Error fetching customers' });
  }
};

const createCustomer = (req, res) => {
  const { name, contact, email } = req.body;

  try {
    // Validate input
    if (!name || !contact || !email) {
      return res.status(400).json({ message: 'Name, contact, and email are required' });
    }

    const newCustomer = {
      id: (customers.length + 1).toString(),
      name,
      contact,
      email
    };

    customers.push(newCustomer);

    logger.info(`Customer created: ${name}`);
    res.status(201).json(newCustomer);
  } catch (error) {
    logger.error(`Error creating customer: ${error.message}`);
    res.status(500).json({ message: 'Error creating customer' });
  }
};

const updateCustomer = (req, res) => {
  const { id } = req.params;
  const { name, contact, email } = req.body;

  try {
    const customerIndex = customers.findIndex(c => c.id === id);

    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update customer
    customers[customerIndex] = {
      ...customers[customerIndex],
      ...(name && { name }),
      ...(contact && { contact }),
      ...(email && { email })
    };

    logger.info(`Customer updated: ${id}`);
    res.json(customers[customerIndex]);
  } catch (error) {
    logger.error(`Error updating customer: ${error.message}`);
    res.status(500).json({ message: 'Error updating customer' });
  }
};

module.exports = { 
  getAllCustomers, 
  createCustomer, 
  updateCustomer,
  customers 
};
