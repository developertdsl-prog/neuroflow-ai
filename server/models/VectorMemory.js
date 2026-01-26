const mongoose = require('mongoose');

const VectorMemorySchema = new mongoose.Schema({
  agentName: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Embedding must be a non-empty array of floats'
    }
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  importanceScore: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.5
  },
  accessedCount: {
    type: Number,
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

VectorMemorySchema.index({ agentName: 1, createdAt: -1 });

module.exports = mongoose.model('VectorMemory', VectorMemorySchema);
