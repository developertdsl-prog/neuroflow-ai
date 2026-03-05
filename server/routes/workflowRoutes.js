const express = require('express');
const router = express.Router();
const workflowCtrl = require('../controllers/workflowController');

router.get('/', workflowCtrl.listWorkflows);
router.post('/execute', workflowCtrl.executeWorkflow);
router.get('/:id', workflowCtrl.getWorkflowById);

module.exports = router;
