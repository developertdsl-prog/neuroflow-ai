const GuardrailRule = require('../models/GuardrailRule');
const GuardrailEngine = require('../services/guardrailEngine');

exports.getGuardrailRules = async (req, res, next) => {
  try {
    const rules = await GuardrailRule.find().sort({ createdAt: -1 });
    res.json({ success: true, count: rules.length, data: rules });
  } catch (err) {
    next(err);
  }
};

exports.createGuardrailRule = async (req, res, next) => {
  try {
    const { name, category, pattern, action, replacementText, severity } = req.body;
    const rule = await GuardrailRule.create({
      name,
      category,
      pattern,
      action,
      replacementText,
      severity
    });
    res.status(201).json({ success: true, data: rule });
  } catch (err) {
    next(err);
  }
};

exports.screenContent = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text field is required for screening' });
    }

    const result = await GuardrailEngine.screenText(text);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
