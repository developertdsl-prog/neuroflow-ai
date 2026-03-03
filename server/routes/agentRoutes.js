const express = require('express');
const router = express.Router();
const agentCtrl = require('../controllers/agentController');

router.get('/', agentCtrl.getAllAgents);
router.post('/', agentCtrl.createAgent);
router.get('/:id', agentCtrl.getAgentById);
router.delete('/:id', agentCtrl.deleteAgent);

module.exports = router;
