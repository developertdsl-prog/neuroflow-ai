const GuardrailRule = require('../models/GuardrailRule');
const logger = require('../utils/logger');
const { GUARDRAIL_ACTIONS, GUARDRAIL_CATEGORIES } = require('../config/agentConstants');

/**
 * Real-time Safety Guardrail Engine
 * Protects against prompt injection attacks, PII leaks, and toxic content.
 */
class GuardrailEngine {
  /**
   * Pre-configured regex patterns for common security vulnerabilities
   */
  static INJECTION_PATTERNS = [
    /ignore\s+all\s+previous\s+instructions/i,
    /system\s*override/i,
    /bypass\s+safety\s+filters/i,
    /disregard\s+prior\s+prompts/i,
    /reveal\s+your\s+initial\s+system\s+prompt/i
  ];

  static PII_PATTERNS = [
    { type: 'EMAIL', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[EMAIL_REDACTED]' },
    { type: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN_REDACTED]' },
    { type: 'CREDIT_CARD', regex: /\b(?:\d{4}[ -]?){3}\d{4}\b/g, replacement: '[CC_REDACTED]' }
  ];

  /**
   * Screens content against stored DB rules and built-in heuristics.
   */
  static async screenText(content) {
    if (!content || typeof content !== 'string') {
      return { passed: true, processedText: content, violations: [] };
    }

    const violations = [];
    let processedText = content;

    // 1. Built-in Prompt Injection Check
    for (const pattern of this.INJECTION_PATTERNS) {
      if (pattern.test(processedText)) {
        violations.push({
          category: GUARDRAIL_CATEGORIES.PROMPT_INJECTION,
          action: GUARDRAIL_ACTIONS.BLOCK,
          reason: 'Potential prompt injection attempt detected'
        });
        return {
          passed: false,
          action: GUARDRAIL_ACTIONS.BLOCK,
          processedText: '[BLOCKED_BY_GUARDRAIL]',
          violations
        };
      }
    }

    // 2. Built-in PII Redaction
    for (const pii of this.PII_PATTERNS) {
      if (pii.regex.test(processedText)) {
        violations.push({
          category: GUARDRAIL_CATEGORIES.PII_LEAK,
          action: GUARDRAIL_ACTIONS.REDACT,
          reason: `Detected sensitive ${pii.type} data`
        });
        processedText = processedText.replace(pii.regex, pii.replacement);
      }
    }

    // 3. Database Rules Check
    try {
      const dbRules = await GuardrailRule.find({ isEnabled: true });
      for (const rule of dbRules) {
        const regex = new RegExp(rule.pattern, 'gi');
        if (regex.test(processedText)) {
          violations.push({
            ruleName: rule.name,
            category: rule.category,
            action: rule.action,
            severity: rule.severity
          });

          if (rule.action === GUARDRAIL_ACTIONS.BLOCK) {
            return {
              passed: false,
              action: GUARDRAIL_ACTIONS.BLOCK,
              processedText: '[BLOCKED_BY_GUARDRAIL]',
              violations
            };
          } else if (rule.action === GUARDRAIL_ACTIONS.REDACT) {
            processedText = processedText.replace(regex, rule.replacementText);
          }
        }
      }
    } catch (err) {
      logger.warn(`Could not query database guardrail rules: ${err.message}`);
    }

    return {
      passed: true,
      action: violations.some(v => v.action === GUARDRAIL_ACTIONS.REDACT) ? GUARDRAIL_ACTIONS.REDACT : GUARDRAIL_ACTIONS.ALLOW,
      processedText,
      violations
    };
  }
}

module.exports = GuardrailEngine;
