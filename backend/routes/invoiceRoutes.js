const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { InvoiceItem } = require('../models');


router.get('/', invoiceController.list);

router.get('/:id', invoiceController.get);

router.post('/', invoiceController.create);

router.post('/:id/issue', invoiceController.issue);

router.get('/:invoiceId/items', async (req, res) => {
  try {
    const items = await InvoiceItem.findAll({
      where: { invoiceId: req.params.invoiceId },
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка при отриманні items' });
  }
});

module.exports = router;
