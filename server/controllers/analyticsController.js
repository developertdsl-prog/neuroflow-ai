const WorkflowExecution = require('../models/WorkflowExecution');
const AgentDefinition = require('../models/AgentDefinition');
const VectorMemory = require('../models/VectorMemory');

exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    const [agentCount, workflowCount, memoryCount, workflows] = await Promise.all([
      AgentDefinition.countDocuments({ isActive: true }),
      WorkflowExecution.countDocuments(),
      VectorMemory.countDocuments(),
      WorkflowExecution.find().sort({ startedAt: -1 }).limit(100).lean()
    ]);

    const completed = workflows.filter(w => w.status === 'COMPLETED').length;
    const successRate = workflowCount > 0 ? ((completed / workflowCount) * 100).toFixed(1) : 100;
    const totalTokens = workflows.reduce((acc, w) => acc + (w.totalTokensUsed || 0), 0);
    const avgLatency = workflows.length > 0 
      ? Math.round(workflows.reduce((acc, w) => acc + (w.totalLatencyMs || 0), 0) / workflows.length)
      : 0;

    res.json({
      success: true,
      data: {
        activeAgents: agentCount,
        totalWorkflows: workflowCount,
        storedVectorMemories: memoryCount,
        successRatePercentage: parseFloat(successRate),
        totalTokensConsumed: totalTokens,
        averageLatencyMs: avgLatency,
        systemStatus: 'HEALTHY_OPTIMAL'
      }
    });
  } catch (err) {
    next(err);
  }
};
