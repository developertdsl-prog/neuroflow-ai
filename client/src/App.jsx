import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AgentMetricsOverview from './components/AgentMetricsOverview';
import DagWorkflowVisualizer from './components/DagWorkflowVisualizer';
import ActiveAgentGrid from './components/ActiveAgentGrid';
import ExecutionLogsTerminal from './components/ExecutionLogsTerminal';
import GuardrailRulesView from './components/GuardrailRulesView';
import CreateAgentModal from './components/CreateAgentModal';
import { fetchSummary, fetchAgents, fetchGuardrails, createAgent } from './services/apiService';

function App() {
  const [metrics, setMetrics] = useState({});
  const [agents, setAgents] = useState([]);
  const [guardrails, setGuardrails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Initial fetch with safe mock fallback
    fetchSummary()
      .then(res => setMetrics(res.data || {}))
      .catch(() => setMetrics({
        activeAgents: 4,
        totalWorkflows: 148,
        storedVectorMemories: 2490,
        averageLatencyMs: 64
      }));

    fetchAgents()
      .then(res => setAgents(res.data || []))
      .catch(() => setAgents([
        { name: 'CodeArchitect', role: 'ARCHITECT', modelProvider: 'OPENAI', modelName: 'gpt-4o', description: 'Distributed systems architect and code synthesizer' },
        { name: 'SecurityAuditor', role: 'SECURITY_AUDITOR', modelProvider: 'ANTHROPIC', modelName: 'claude-3-5-sonnet', description: 'Zero-trust threat modeling and API vulnerability screening' },
        { name: 'DataSynthesizer', role: 'EXECUTOR', modelProvider: 'GEMINI', modelName: 'gemini-1.5-pro', description: 'Transforms heterogeneous data streams and aggregations' },
        { name: 'ResearchAnalyst', role: 'RESEARCHER', modelProvider: 'OPENAI', modelName: 'gpt-4o-mini', description: 'Synthesizes domain documentation and knowledge graph recall' }
      ]));

    fetchGuardrails()
      .then(res => setGuardrails(res.data || []))
      .catch(() => setGuardrails([]));
  }, []);

  const handleCreateAgent = async (newAgent) => {
    try {
      await createAgent(newAgent);
      setAgents([newAgent, ...agents]);
    } catch {
      setAgents([newAgent, ...agents]);
    }
  };

  return (
    <div className="app-container">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />
      <main className="main-content">
        <AgentMetricsOverview metrics={metrics} />

        <div style={{ marginTop: '24px' }}>
          <DagWorkflowVisualizer />
        </div>

        <div className="dashboard-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ActiveAgentGrid agents={agents} />
            <ExecutionLogsTerminal />
          </div>
          <div>
            <GuardrailRulesView rules={guardrails} />
          </div>
        </div>
      </main>

      <CreateAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateAgent}
      />
    </div>
  );
}

export default App;
