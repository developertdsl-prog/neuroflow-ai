const DagOrchestrator = require('../services/dagOrchestrator');
const { WORKFLOW_STATUS } = require('../config/agentConstants');

describe('WorkflowExecution Lifecycle Test Suite', () => {
  test('Executes all stages and aggregates node results', async () => {
    const mockWorkflow = {
      workflowName: 'Unit-Test-Workflow',
      nodes: [
        { id: 'stepA', agentName: 'Architect', dependencies: [] },
        { id: 'stepB', agentName: 'Executor', dependencies: ['stepA'] }
      ],
      nodeResults: []
    };

    const mockExecutor = async (node, deps) => {
      return {
        status: WORKFLOW_STATUS.COMPLETED,
        tokensUsed: 150,
        outputResult: `Success on ${node.id}`
      };
    };

    const completed = await DagOrchestrator.executeWorkflow(mockWorkflow, mockExecutor);
    expect(completed.nodeResults).toHaveLength(2);
    expect(completed.totalLatencyMs).toBeGreaterThanOrEqual(0);
  });
});
