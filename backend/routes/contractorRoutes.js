const express = require('express');
const router = express.Router();
const contractorController = require('../controllers/contractorController');

router.get('/', contractorController.list);
router.get('/:id', contractorController.get);
router.post('/', contractorController.create);
router.put('/:id', contractorController.update);
router.delete('/:id', contractorController.remove);

module.exports = router;
