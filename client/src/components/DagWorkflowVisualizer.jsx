import React from 'react';

const DagWorkflowVisualizer = ({ activeWorkflow }) => {
  const sampleNodes = [
    { id: '1', title: 'Prompt Ingestion', status: 'COMPLETED', agent: 'Coordinator' },
    { id: '2', title: 'Security Guardrail Check', status: 'COMPLETED', agent: 'SecurityAuditor' },
    { id: '3', title: 'Vector Memory Recall', status: 'COMPLETED', agent: 'ResearchAnalyst' },
    { id: '4', title: 'Topological Code Synthesis', status: 'RUNNING', agent: 'CodeArchitect' },
    { id: '5', title: 'Result Verification', status: 'PENDING', agent: 'Validator' }
  ];

  return (
    <div className="card">
      <div className="card-title">
        <span>Active DAG Orchestration Pipeline</span>
        <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
          Workflow ID: {activeWorkflow?._id || 'wf-live-8831'}
        </span>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 12px',
        background: '#0e121d',
        borderRadius: '8px',
        gap: '12px'
      }}>
        {sampleNodes.map((node, idx) => (
          <React.Fragment key={node.id}>
            <div style={{
              background: '#161c2e',
              border: `1px solid ${node.status === 'RUNNING' ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
              borderRadius: '8px',
              padding: '12px 16px',
              minWidth: '160px',
              boxShadow: node.status === 'RUNNING' ? '0 0 12px rgba(0, 242, 254, 0.3)' : 'none'
            }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Step {node.id}</p>
              <h4 style={{ fontSize: '0.85rem', margin: '4px 0', color: '#fff' }}>{node.title}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-blue)' }}>{node.agent}</p>
            </div>
            {idx < sampleNodes.length - 1 && (
              <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>➔</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DagWorkflowVisualizer;
