const express = require('express');
const router = express.Router();
const restockController = require('../controllers/restockController');

router.get('/', restockController.getAll);
router.get('/:id_restock', restockController.getById);
router.post('/', restockController.createOrUpdate);