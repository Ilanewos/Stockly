const express = require('express');
const router = express.Router();
const restokController = require('../controllers/restokController');

router.get('/', restokController.getAllRestok);
router.post('/', restokController.createRestok);

module.exports = router;
