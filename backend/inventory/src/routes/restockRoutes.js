const express = require('express');
const router = express.Router();
const restockController = require('../controllers/restockController');

router.get('/', restockController.getAll);
router.get('/:id_restock', restockController.getById);
router.post('/', restockController.createOrUpdate);
router.put('/:id_restock', restockController.update);
router.delete('/:id_restock', restockController.delete);

module.exports = router;