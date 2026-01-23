const mongoose = require('mongoose');
const { WORKFLOW_STATUS } = require('../config/agentConstants');

const AgentTaskSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AgentDefinition',
    required: true
  },
  agentName: {
    type: String,
    required: true
  },
  taskType: {
    type: String,
    required: true,
    enum: ['ANALYSIS', 'CODE_GENERATION', 'AUDIT', 'TRANSFORMATION', 'GENERAL']
  },
  promptInput: {
    type: String,
    required: true
  },
  completionOutput: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: Object.values(WORKFLOW_STATUS),
    default: WORKFLOW_STATUS.PENDING
  },
  toolInvocations: [{
    toolName: String,
    args: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    durationMs: Number
  }],
  latencyMs: {
    type: Number,
    default: 0
  },
  tokensUsed: {
    promptTokens: { type: Number, default: 0 },
    completionTokens: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

AgentTaskSchema.index({ agentId: 1, status: 1 });

module.exports = mongoose.model('AgentTask', AgentTaskSchema);
