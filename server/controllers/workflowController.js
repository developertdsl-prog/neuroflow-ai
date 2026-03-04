const WorkflowExecution = require('../models/WorkflowExecution');
const DagOrchestrator = require('../services/dagOrchestrator');
const GuardrailEngine = require('../services/guardrailEngine');
const { WORKFLOW_STATUS, GUARDRAIL_ACTIONS } = require('../config/agentConstants');
const logger = require('../utils/logger');

exports.executeWorkflow = async (req, res, next) => {
  try {
    const { workflowName, nodes, initiator } = req.body;

    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
      return res.status(400).json({ success: false, error: 'Workflow requires an array of nodes' });
    }

    // 1. Initial Guardrail Screen on all prompts
    for (const node of nodes) {
      const screenResult = await GuardrailEngine.screenText(node.promptTemplate);
      if (!screenResult.passed && screenResult.action === GUARDRAIL_ACTIONS.BLOCK) {
        return res.status(403).json({
          success: false,
          error: `Safety Guardrail violation in node '${node.id}': Prompt blocked.`,
          violations: screenResult.violations
        });
      }
      node.promptTemplate = screenResult.processedText;
    }

    const workflow = new WorkflowExecution({
      workflowName: workflowName || 'Autonomous-DAG-Run',
      nodes,
      initiator: initiator || 'APIUser',
      status: WORKFLOW_STATUS.RUNNING
    });

    // Mock Node Executor simulating LLM task completion
    const nodeExecutor = async (node, depResults) => {
      const stepStart = Date.now();
      const mockCompletion = `Completed step '${node.id}' using agent '${node.agentName}'. Processed ${depResults.length} upstream dependencies.`;
      const duration = Date.now() - stepStart + 45;
      
      return {
        agentName: node.agentName,
        inputContext: { template: node.promptTemplate, upstreamCount: depResults.length },
        outputResult: mockCompletion,
        status: WORKFLOW_STATUS.COMPLETED,
        executionTimeMs: duration,
        tokensUsed: 320
      };
    };

    const executedWorkflow = await DagOrchestrator.executeWorkflow(workflow, nodeExecutor);
    executedWorkflow.status = WORKFLOW_STATUS.COMPLETED;
    executedWorkflow.completedAt = new Date();
    executedWorkflow.totalTokensUsed = executedWorkflow.nodeResults.reduce((acc, r) => acc + (r.tokensUsed || 0), 0);

    await executedWorkflow.save();

    res.status(201).json({
      success: true,
      message: 'DAG workflow successfully orchestrated',
      data: executedWorkflow
    });
  } catch (err) {
    logger.error(`Workflow execution failed: ${err.message}`);
    next(err);
  }
};

exports.getWorkflowById = async (req, res, next) => {
  try {
    const workflow = await WorkflowExecution.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ success: false, error: 'Workflow execution record not found' });
    }
    res.json({ success: true, data: workflow });
  } catch (err) {
    next(err);
  }
};

exports.listWorkflows = async (req, res, next) => {
  try {
    const workflows = await WorkflowExecution.find().sort({ startedAt: -1 }).limit(50);
    res.json({ success: true, count: workflows.length, data: workflows });
  } catch (err) {
    next(err);
  }
};
