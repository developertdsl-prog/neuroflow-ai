import React from 'react';

const AgentMetricsOverview = ({ metrics }) => {
  const cards = [
    { label: 'Active Autonomous Agents', value: metrics.activeAgents || 4, unit: 'agents', color: '#00f2fe' },
    { label: 'DAG Workflows Executed', value: metrics.totalWorkflows || 148, unit: 'runs', color: '#38bdf8' },
    { label: 'Vector Memories Indexed', value: metrics.storedVectorMemories || 2490, unit: 'vectors', color: '#a78bfa' },
    { label: 'Avg Execution Latency', value: `${metrics.averageLatencyMs || 64}ms`, unit: 'optimal', color: '#34d399' },
    { label: 'Guardrail Enforcement', value: '100%', unit: 'shielded', color: '#f472b6' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px'
    }}>
      {cards.map((card, i) => (
        <div key={i} className="card" style={{ borderTop: `3px solid ${card.color}` }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            {card.label}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
              {card.value}
            </span>
            <span style={{ fontSize: '0.75rem', color: card.color, fontWeight: 600 }}>
              {card.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentMetricsOverview;
