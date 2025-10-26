const express = require('express');
const router = express.Router();
const bahanController = require('../controllers/bahanController');

router.get('/', bahanController.getAll);