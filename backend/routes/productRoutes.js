const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.get('/', productController.list);
router.post('/', productController.create);
router.get('/:id', productController.get);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);
router.get('/low-stock', async (req, res) => {
  try {
    const products = await Product.findAll({ where: { quantity: { [require('sequelize').Op.lte]: require('../models').Product.rawAttributes.minStock.defaultValue || 0 } } });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



module.exports = router;