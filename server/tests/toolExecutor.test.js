const ToolExecutor = require('../services/toolExecutor');

describe('ToolExecutor Sandboxing Test Suite', () => {
  test('Safely executes calculator arithmetic expressions', async () => {
    const res = await ToolExecutor.executeTool('calculator', { expression: '25 * 4 + 10' });
    expect(res.success).toBe(true);
    expect(res.output.evaluated).toBe(110);
  });

  test('Rejects malicious command injection in calculator', async () => {
    const res = await ToolExecutor.executeTool('calculator', { expression: 'process.exit(1)' });
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Disallowed characters/);
  });

  test('Generates index execution plan for SQL queries', async () => {
    const res = await ToolExecutor.executeTool('sqlQueryPlan', { query: 'SELECT * FROM users WHERE id = 1' });
    expect(res.success).toBe(true);
    expect(res.output.strategy).toBe('IndexScan');
  });

  test('Gracefully handles unregistered tools', async () => {
    const res = await ToolExecutor.executeTool('nonExistentTool', {});
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Unregistered tool/);
  });
});
