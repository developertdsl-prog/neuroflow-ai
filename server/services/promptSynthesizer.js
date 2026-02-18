/**
 * Prompt Synthesizer
 * Formats system prompts, dynamically injects contextual variables,
 * and formats episodic memories into few-shot context windows.
 */
class PromptSynthesizer {
  /**
   * Replaces dynamic tokens in format {{variable}} with context values.
   */
  static interpolateTemplate(template, context = {}) {
    if (!template || typeof template !== 'string') return '';
    return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
      return context[key] !== undefined ? String(context[key]) : match;
    });
  }

  /**
   * Synthesizes full system prompt with episodic memories.
   */
  static buildPromptWithMemories(agent, inputPrompt, episodicMemories = []) {
    let synthesized = `[ROLE: ${agent.role}]\n[SYSTEM PROMPT]: ${agent.systemPrompt}\n\n`;

    if (episodicMemories && episodicMemories.length > 0) {
      synthesized += `[RELEVANT EPISODIC MEMORIES]:\n`;
      episodicMemories.forEach((mem, idx) => {
        synthesized += `${idx + 1}. ${mem.content} (Score: ${mem.similarityScore?.toFixed(3) || 'N/A'})\n`;
      });
      synthesized += `\n`;
    }

    synthesized += `[USER INPUT]:\n${inputPrompt}`;
    return synthesized;
  }
}

module.exports = PromptSynthesizer;
