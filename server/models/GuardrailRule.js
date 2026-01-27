const mongoose = require('mongoose');
const { GUARDRAIL_ACTIONS, GUARDRAIL_CATEGORIES } = require('../config/agentConstants');

const GuardrailRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: Object.values(GUARDRAIL_CATEGORIES),
    required: true
  },
  pattern: {
    type: String,
    required: true,
    description: 'Regex pattern or semantic keyword matcher'
  },
  action: {
    type: String,
    enum: Object.values(GUARDRAIL_ACTIONS),
    default: GUARDRAIL_ACTIONS.BLOCK
  },
  replacementText: {
    type: String,
    default: '[REDACTED_BY_GUARDRAIL]'
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'HIGH'
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GuardrailRule', GuardrailRuleSchema);
