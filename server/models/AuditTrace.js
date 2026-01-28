const mongoose = require('mongoose');

const AuditTraceSchema = new mongoose.Schema({
  traceId: {
    type: String,
    required: true,
    index: true
  },
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkflowExecution'
  },
  agentName: {
    type: String,
    required: true
  },
  actionType: {
    type: String,
    required: true,
    enum: ['GUARDRAIL_SCAN', 'TOOL_EXECUTION', 'MODEL_PROMPT', 'STATE_TRANSITION', 'SECURITY_ALERT']
  },
  payload: {
    type: mongoose.Schema.Types.Mixed
  },
  verdict: {
    type: String,
    enum: ['ALLOWED', 'BLOCKED', 'REDACTED', 'FLAGGED', 'SUCCESS', 'FAILED'],
    default: 'SUCCESS'
  },
  clientIp: {
    type: String,
    default: '127.0.0.1'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

AuditTraceSchema.index({ traceId: 1, timestamp: -1 });

module.exports = mongoose.model('AuditTrace', AuditTraceSchema);
