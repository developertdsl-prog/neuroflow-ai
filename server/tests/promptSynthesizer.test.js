const PromptSynthesizer = require('../services/promptSynthesizer');

describe('PromptSynthesizer Template Test Suite', () => {
  test('Interpolates context variables correctly', () => {
    const template = 'Hello {{userName}}, your active project is {{projectName}}.';
    const context = { userName: 'Alice', projectName: 'NeuroFlow-AI' };

    const rendered = PromptSynthesizer.interpolateTemplate(template, context);
    expect(rendered).toBe('Hello Alice, your active project is NeuroFlow-AI.');
  });

  test('Integrates episodic memories into synthesized system prompt', () => {
    const mockAgent = { role: 'RESEARCHER', systemPrompt: 'Investigate system performance.' };
    const memories = [
      { content: 'Prior bottleneck identified in Redis queue.', similarityScore: 0.89 }
    ];

    const prompt = PromptSynthesizer.buildPromptWithMemories(mockAgent, 'Evaluate current throughput', memories);
    expect(prompt).toContain('[ROLE: RESEARCHER]');
    expect(prompt).toContain('Prior bottleneck identified in Redis queue.');
    expect(prompt).toContain('[USER INPUT]:');
  });
});
