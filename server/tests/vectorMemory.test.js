const VectorMemoryManager = require('../services/vectorMemoryManager');

describe('VectorMemoryManager Test Suite', () => {
  test('Calculates identical vector similarity as 1.0', () => {
    const vecA = [0.5, 0.5, 0.5, 0.5];
    const similarity = VectorMemoryManager.cosineSimilarity(vecA, vecA);
    expect(similarity).toBeCloseTo(1.0, 4);
  });

  test('Calculates orthogonal vectors similarity as 0.0', () => {
    const vecA = [1, 0, 0, 0];
    const vecB = [0, 1, 0, 0];
    const similarity = VectorMemoryManager.cosineSimilarity(vecA, vecB);
    expect(similarity).toBeCloseTo(0.0, 4);
  });

  test('Generates deterministic normalized embedding vectors', () => {
    const text = 'NeuroFlow AI Autonomous Multi-Agent';
    const emb1 = VectorMemoryManager.generateDeterministicEmbedding(text, 8);
    const emb2 = VectorMemoryManager.generateDeterministicEmbedding(text, 8);

    expect(emb1).toEqual(emb2);
    expect(emb1).toHaveLength(8);

    // Verify L2 norm is 1
    const norm = Math.sqrt(emb1.reduce((sum, v) => sum + v * v, 0));
    expect(norm).toBeCloseTo(1.0, 3);
  });
});
