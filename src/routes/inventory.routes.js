const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  updateProductStock 
} = require('../services/inventory.service');
const { checkRole } = require('../middleware/auth.middleware');

router.get('/products', checkRole(['admin', 'sales']), getAllProducts);
router.put('/products/:id', checkRole(['admin', 'sales']), updateProductStock);

module.exports = router;

