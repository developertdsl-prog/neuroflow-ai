const mongoose = require('mongoose');
const { WORKFLOW_STATUS } = require('../config/agentConstants');

const NodeResultSchema = new mongoose.Schema({
  nodeId: { type: String, required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentDefinition' },
  agentName: { type: String, required: true },
  inputContext: { type: mongoose.Schema.Types.Mixed },
  outputResult: { type: mongoose.Schema.Types.Mixed },
  status: {
    type: String,
    enum: Object.values(WORKFLOW_STATUS),
    default: WORKFLOW_STATUS.PENDING
  },
  executionTimeMs: { type: Number, default: 0 },
  tokensUsed: { type: Number, default: 0 },
  error: { type: String, default: null }
}, { _id: false });

const WorkflowExecutionSchema = new mongoose.Schema({
  workflowName: {
    type: String,
    required: [true, 'Workflow name is required'],
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(WORKFLOW_STATUS),
    default: WORKFLOW_STATUS.PENDING
  },
  nodes: [{
    id: { type: String, required: true },
    agentName: { type: String, required: true },
    dependencies: [{ type: String }],
    promptTemplate: { type: String, required: true }
  }],
  nodeResults: [NodeResultSchema],
  totalTokensUsed: {
    type: Number,
    default: 0
  },
  totalLatencyMs: {
    type: Number,
    default: 0
  },
  initiator: {
    type: String,
    default: 'SystemOrchestrator'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

WorkflowExecutionSchema.index({ status: 1, startedAt: -1 });

module.exports = mongoose.model('WorkflowExecution', WorkflowExecutionSchema);
