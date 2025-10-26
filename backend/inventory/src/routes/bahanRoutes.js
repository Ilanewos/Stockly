const express = require('express');
const router = express.Router();
const bahanController = require('../controllers/bahanController');

router.get('/', bahanController.getAll);
router.get('/:id_bahan', bahanController.getById);
router.post('/', bahanController.create);