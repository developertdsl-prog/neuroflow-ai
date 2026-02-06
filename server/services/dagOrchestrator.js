const logger = require('../utils/logger');

/**
 * Enterprise DAG Orchestrator
 * Performs topological sorting, detects cyclical dependencies via Kahn's Algorithm,
 * and schedules parallel execution of independent dependency layers.
 */
class DagOrchestrator {
  /**
   * Validates DAG integrity and computes execution order.
   * @param {Array} nodes - Array of nodes with id and dependencies
   * @returns {Array<Array<string>>} Array of execution stages (each stage can run in parallel)
   */
  static planExecutionStages(nodes) {
    const inDegree = new Map();
    const adjList = new Map();
    const allNodeIds = new Set();

    nodes.forEach(node => {
      allNodeIds.add(node.id);
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
    });

    // Populate adjacency list and in-degrees
    nodes.forEach(node => {
      const deps = node.dependencies || [];
      deps.forEach(depId => {
        if (!allNodeIds.has(depId)) {
          throw new Error(`Invalid DAG: Node '${node.id}' depends on non-existent node '${depId}'`);
        }
        adjList.get(depId).push(node.id);
        inDegree.set(node.id, inDegree.get(node.id) + 1);
      });
    });

    const stages = [];
    let processedCount = 0;

    // Find all nodes with zero dependencies
    let currentBatch = [];
    inDegree.forEach((deg, id) => {
      if (deg === 0) currentBatch.push(id);
    });

    while (currentBatch.length > 0) {
      stages.push(currentBatch);
      processedCount += currentBatch.length;
      const nextBatch = [];

      currentBatch.forEach(nodeId => {
        const neighbors = adjList.get(nodeId) || [];
        neighbors.forEach(neighborId => {
          inDegree.set(neighborId, inDegree.get(neighborId) - 1);
          if (inDegree.get(neighborId) === 0) {
            nextBatch.push(neighborId);
          }
        });
      });

      currentBatch = nextBatch;
    }

    if (processedCount !== nodes.length) {
      throw new Error('Cyclic dependency detected in workflow DAG. Execution aborted.');
    }

    return stages;
  }

  /**
   * Executes a registered DAG workflow stage-by-stage.
   * @param {Object} workflow - Workflow model instance
   * @param {Function} nodeExecutor - Callback to execute each node
   */
  static async executeWorkflow(workflow, nodeExecutor) {
    const stages = this.planExecutionStages(workflow.nodes);
    const executionContext = new Map();
    const startTime = Date.now();

    logger.info(`Starting DAG workflow '${workflow.workflowName}' with ${stages.length} stages.`);

    for (let stageIdx = 0; stageIdx < stages.length; stageIdx++) {
      const currentStage = stages[stageIdx];
      logger.info(`Executing Stage ${stageIdx + 1}/${stages.length} with ${currentStage.length} parallel nodes`);

      // Run independent nodes in parallel
      const stagePromises = currentStage.map(async (nodeId) => {
        const node = workflow.nodes.find(n => n.id === nodeId);
        const depResults = (node.dependencies || []).map(depId => executionContext.get(depId));
        
        const nodeResult = await nodeExecutor(node, depResults);
        executionContext.set(nodeId, nodeResult);
        return { nodeId, ...nodeResult };
      });

      const results = await Promise.all(stagePromises);
      results.forEach(res => {
        const existingIdx = workflow.nodeResults.findIndex(r => r.nodeId === res.nodeId);
        if (existingIdx >= 0) {
          workflow.nodeResults[existingIdx] = res;
        } else {
          workflow.nodeResults.push(res);
        }
      });
    }

    const duration = Date.now() - startTime;
    workflow.totalLatencyMs = duration;
    return workflow;
  }
}

module.exports = DagOrchestrator;
