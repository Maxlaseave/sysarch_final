const logger = require('../utils/logger');

const inventory = [
  { id: '1', name: 'Laptop', stock: 50, supplier: 'Tech Suppliers Inc' },
  { id: '2', name: 'Smartphone', stock: 100, supplier: 'Global Electronics' }
];

const getAllProducts = (req, res) => {
  try {
    logger.info('Fetching all inventory products');
    res.json(inventory);
  } catch (error) {
    logger.error(`Error fetching inventory: ${error.message}`);
    res.status(500).json({ message: 'Error fetching inventory' });
  }
};

const updateProductStock = (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    const productIndex = inventory.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update stock
    inventory[productIndex] = {
      ...inventory[productIndex],
      stock: stock !== undefined ? stock : inventory[productIndex].stock
    };

    logger.info(`Product stock updated: ${id}`);
    res.json(inventory[productIndex]);
  } catch (error) {
    logger.error(`Error updating product stock: ${error.message}`);
    res.status(500).json({ message: 'Error updating product stock' });
  }
};

module.exports = { 
  getAllProducts, 
  updateProductStock,
  inventory 
};