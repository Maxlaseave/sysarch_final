const express = require('express');
const router = express.Router();
const { 
  getAllCustomers, 
  createCustomer, 
  updateCustomer 
} = require('../services/crm.service');
const { checkRole } = require('../middleware/auth.middleware');

router.get('/customers', checkRole(['admin', 'sales']), getAllCustomers);
router.post('/customers', checkRole(['admin', 'sales']), createCustomer);
router.put('/customers/:id', checkRole(['admin', 'sales']), updateCustomer);

module.exports = router;