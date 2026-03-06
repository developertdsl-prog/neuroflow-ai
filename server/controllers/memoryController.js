const VectorMemory = require('../models/VectorMemory');
const VectorMemoryManager = require('../services/vectorMemoryManager');

exports.storeMemory = async (req, res, next) => {
  try {
    const { agentName, content, metadata, importanceScore } = req.body;
    if (!agentName || !content) {
      return res.status(400).json({ success: false, error: 'agentName and content are required' });
    }

    const embedding = VectorMemoryManager.generateDeterministicEmbedding(content, 8);
    const memory = await VectorMemory.create({
      agentName,
      content,
      embedding,
      metadata: metadata || {},
      importanceScore: importanceScore || 0.6
    });

    res.status(201).json({ success: true, data: memory });
  } catch (err) {
    next(err);
  }
};

exports.searchMemory = async (req, res, next) => {
  try {
    const { agentName, query, topK, threshold } = req.body;
    if (!agentName || !query) {
      return res.status(400).json({ success: false, error: 'agentName and query are required' });
    }

    const queryEmbedding = VectorMemoryManager.generateDeterministicEmbedding(query, 8);
    const results = await VectorMemoryManager.searchNearestMemories(
      agentName,
      queryEmbedding,
      parseInt(topK, 10) || 5,
      parseFloat(threshold) || 0.5
    );

    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
};
