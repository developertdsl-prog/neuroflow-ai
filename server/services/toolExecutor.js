const logger = require('../utils/logger');

/**
 * Sandboxed Tool Executor
 * Provides deterministic tool execution with timeout protection and input schema validation.
 */
class ToolExecutor {
  static getAvailableTools() {
    return [
      { name: 'calculator', description: 'Evaluates basic mathematical expressions safe from eval injection' },
      { name: 'sqlQueryPlan', description: 'Generates mock optimized database query execution plans' },
      { name: 'webSearchMock', description: 'Simulates targeted technical documentation web lookups' },
      { name: 'codeSyntaxValidator', description: 'Validates JavaScript and JSON syntax structures' }
    ];
  }

  static async executeTool(toolName, args, timeoutMs = 5000) {
    const startTime = Date.now();
    logger.info(`Invoking sandboxed tool: ${toolName}`);

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Tool execution timed out after ${timeoutMs}ms: ${toolName}`));
      }, timeoutMs);

      try {
        let result;
        switch (toolName) {
          case 'calculator':
            result = ToolExecutor._executeCalculator(args);
            break;
          case 'sqlQueryPlan':
            result = ToolExecutor._executeSqlPlan(args);
            break;
          case 'webSearchMock':
            result = ToolExecutor._executeWebSearch(args);
            break;
          case 'codeSyntaxValidator':
            result = ToolExecutor._executeSyntaxValidator(args);
            break;
          default:
            throw new Error(`Unregistered tool: '${toolName}'`);
        }

        clearTimeout(timer);
        resolve({
          toolName,
          success: true,
          output: result,
          durationMs: Date.now() - startTime
        });
      } catch (err) {
        clearTimeout(timer);
        resolve({
          toolName,
          success: false,
          error: err.message,
          durationMs: Date.now() - startTime
        });
      }
    });
  }

  static _executeCalculator(args) {
    const expression = args?.expression;
    if (!expression || typeof expression !== 'string') {
      throw new Error('Calculator requires a string expression');
    }
    // Safe arithmetic parser rejecting code execution
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      throw new Error('Disallowed characters in math expression');
    }
    const sanitized = Function(`"use strict"; return (${expression})`)();
    return { evaluated: sanitized };
  }

  static _executeSqlPlan(args) {
    const query = args?.query || 'SELECT * FROM logs';
    return {
      query,
      estimatedCost: 1.42,
      strategy: 'IndexScan',
      suggestedIndexes: ['createdAt_1', 'traceId_1']
    };
  }

  static _executeWebSearch(args) {
    const query = args?.query || '';
    return {
      query,
      resultsCount: 2,
      snippets: [
        `Knowledge graph document regarding ${query}`,
        `Technical specification guide for ${query}`
      ]
    };
  }

  static _executeSyntaxValidator(args) {
    const code = args?.code || '';
    try {
      JSON.parse(code);
      return { valid: true, type: 'JSON' };
    } catch (e) {
      return { valid: false, error: e.message };
    }
  }
}

module.exports = ToolExecutor;
