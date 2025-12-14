const express = require('express');
const router = express.Router();
const actController = require('../controllers/actController');

router.get('/', actController.list);
router.get('/:id', actController.get);
router.post('/', actController.create);

module.exports = router;
