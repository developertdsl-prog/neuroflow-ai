const express = require('express');
const router = express.Router();
const guardrailCtrl = require('../controllers/guardrailController');

router.get('/', guardrailCtrl.getGuardrailRules);
router.post('/', guardrailCtrl.createGuardrailRule);
router.post('/screen', guardrailCtrl.screenContent);

module.exports = router;
