const mongoose = require('mongoose');
const { AGENT_ROLES, MODEL_PROVIDERS } = require('../config/agentConstants');

const AgentDefinitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Agent name is required'],
    trim: true,
    unique: true
  },
  role: {
    type: String,
    enum: Object.values(AGENT_ROLES),
    default: AGENT_ROLES.EXECUTOR
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  systemPrompt: {
    type: String,
    required: [true, 'System prompt template is required']
  },
  modelProvider: {
    type: String,
    enum: Object.values(MODEL_PROVIDERS),
    default: MODEL_PROVIDERS.OPENAI
  },
  modelName: {
    type: String,
    default: 'gpt-4o'
  },
  temperature: {
    type: Number,
    min: 0.0,
    max: 2.0,
    default: 0.2
  },
  allowedTools: [{
    type: String,
    trim: true
  }],
  memoryStrategy: {
    type: String,
    enum: ['EPISODIC_VECTOR', 'BUFFER_WINDOW', 'STATELESS'],
    default: 'EPISODIC_VECTOR'
  },
  maxTokens: {
    type: Number,
    default: 4096
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

AgentDefinitionSchema.index({ role: 1, isActive: 1 });

module.exports = mongoose.model('AgentDefinition', AgentDefinitionSchema);
