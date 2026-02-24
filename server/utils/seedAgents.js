const mongoose = require('mongoose');
const AgentDefinition = require('../models/AgentDefinition');
const GuardrailRule = require('../models/GuardrailRule');
const logger = require('./logger');

const agentsToSeed = [
  {
    name: 'CodeArchitect',
    role: 'ARCHITECT',
    description: 'Specializes in high-performance distributed systems architecture and code generation',
    systemPrompt: 'You are an enterprise software architect. Design clean, scalable, decoupled systems using standard patterns.',
    modelProvider: 'OPENAI',
    modelName: 'gpt-4o',
    temperature: 0.1,
    allowedTools: ['codeSyntaxValidator', 'calculator'],
    memoryStrategy: 'EPISODIC_VECTOR'
  },
  {
    name: 'SecurityAuditor',
    role: 'SECURITY_AUDITOR',
    description: 'Conducts automated threat modeling, API vulnerability assessment, and CVE checks',
    systemPrompt: 'You are a zero-trust security auditor. Analyze systems for injection vectors, PII leaks, and privilege escalations.',
    modelProvider: 'ANTHROPIC',
    modelName: 'claude-3-5-sonnet',
    temperature: 0.05,
    allowedTools: ['sqlQueryPlan'],
    memoryStrategy: 'EPISODIC_VECTOR'
  },
  {
    name: 'DataSynthesizer',
    role: 'EXECUTOR',
    description: 'Transforms heterogeneous data payloads and runs mathematical aggregations',
    systemPrompt: 'You are an expert data transformation agent. Ingest raw streams and produce validated structured datasets.',
    modelProvider: 'GEMINI',
    modelName: 'gemini-1.5-pro',
    temperature: 0.2,
    allowedTools: ['calculator'],
    memoryStrategy: 'BUFFER_WINDOW'
  },
  {
    name: 'ResearchAnalyst',
    role: 'RESEARCHER',
    description: 'Synthesizes technical documentation, whitepapers, and real-time domain intelligence',
    systemPrompt: 'You are a technical research analyst. Synthesize insights clearly with authoritative citations.',
    modelProvider: 'OPENAI',
    modelName: 'gpt-4o-mini',
    temperature: 0.3,
    allowedTools: ['webSearchMock'],
    memoryStrategy: 'EPISODIC_VECTOR'
  }
];

const rulesToSeed = [
  {
    name: 'Block-System-Override',
    category: 'PROMPT_INJECTION',
    pattern: 'ignore previous instructions|system override|jailbreak',
    action: 'BLOCK',
    severity: 'CRITICAL'
  },
  {
    name: 'Redact-Secret-API-Keys',
    category: 'PII_LEAK',
    pattern: 'sk-[a-zA-Z0-9]{20,}',
    action: 'REDACT',
    replacementText: '[API_KEY_REDACTED]',
    severity: 'HIGH'
  }
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/neuroflow_ai';
  await mongoose.connect(uri);
  logger.info('Connected to MongoDB for seeding initial agent templates...');

  for (const agent of agentsToSeed) {
    await AgentDefinition.findOneAndUpdate({ name: agent.name }, agent, { upsert: true, new: true });
    logger.info(`Seeded Agent: ${agent.name} (${agent.role})`);
  }

  for (const rule of rulesToSeed) {
    await GuardrailRule.findOneAndUpdate({ name: rule.name }, rule, { upsert: true, new: true });
    logger.info(`Seeded Guardrail Rule: ${rule.name}`);
  }

  logger.info('Seeding finished successfully.');
  await mongoose.disconnect();
}

if (require.main === module) {
  seed().catch(err => {
    logger.error(`Seed error: ${err.message}`);
    process.exit(1);
  });
}

module.exports = seed;
