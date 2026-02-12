const VectorMemory = require('../models/VectorMemory');
const logger = require('../utils/logger');

/**
 * High-Performance Vector Episodic Memory Manager
 * Handles vector normalization, cosine similarity ranking, and k-nearest-neighbors recall.
 */
class VectorMemoryManager {
  /**
   * Calculates cosine similarity between two numeric vectors.
   */
  static cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Searches memories for an agent sorted by semantic similarity.
   */
  static async searchNearestMemories(agentName, queryVector, topK = 5, threshold = 0.5) {
    try {
      const candidates = await VectorMemory.find({ agentName }).limit(200).lean();
      if (!candidates || candidates.length === 0) return [];

      const scored = candidates.map(mem => {
        const similarity = VectorMemoryManager.cosineSimilarity(queryVector, mem.embedding);
        return {
          id: mem._id,
          content: mem.content,
          metadata: mem.metadata,
          similarityScore: similarity,
          createdAt: mem.createdAt
        };
      });

      return scored
        .filter(item => item.similarityScore >= threshold)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, topK);
    } catch (error) {
      logger.error(`Vector search error for agent '${agentName}': ${error.message}`);
      return [];
    }
  }

  /**
   * Generates a deterministic mock embedding vector of specified dimensions.
   */
  static generateDeterministicEmbedding(text, dimensions = 8) {
    const vec = new Array(dimensions).fill(0);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      vec[i % dimensions] += charCode / 1000;
    }
    // L2 Normalize
    const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return norm > 0 ? vec.map(val => val / norm) : vec;
  }
}

module.exports = VectorMemoryManager;
