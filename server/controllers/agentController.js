const AgentDefinition = require('../models/AgentDefinition');

exports.getAllAgents = async (req, res, next) => {
  try {
    const agents = await AgentDefinition.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: agents.length, data: agents });
  } catch (err) {
    next(err);
  }
};

exports.getAgentById = async (req, res, next) => {
  try {
    const agent = await AgentDefinition.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent profile not found' });
    }
    res.json({ success: true, data: agent });
  } catch (err) {
    next(err);
  }
};

exports.createAgent = async (req, res, next) => {
  try {
    const { name, role, description, systemPrompt, modelProvider, modelName, temperature, allowedTools, maxTokens } = req.body;
    const agent = await AgentDefinition.create({
      name,
      role,
      description,
      systemPrompt,
      modelProvider,
      modelName,
      temperature,
      allowedTools,
      maxTokens
    });
    res.status(201).json({ success: true, data: agent });
  } catch (err) {
    next(err);
  }
};

exports.deleteAgent = async (req, res, next) => {
  try {
    const agent = await AgentDefinition.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent profile not found' });
    }
    res.json({ success: true, message: 'Agent deactivated successfully' });
  } catch (err) {
    next(err);
  }
};
