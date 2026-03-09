const express = require('express');
const router = express.Router();
const memoryCtrl = require('../controllers/memoryController');

router.post('/', memoryCtrl.storeMemory);
router.post('/search', memoryCtrl.searchMemory);

module.exports = router;
