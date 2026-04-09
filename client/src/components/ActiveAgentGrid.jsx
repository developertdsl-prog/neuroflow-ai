import React from 'react';

const ActiveAgentGrid = ({ agents }) => {
  return (
    <div className="card">
      <div className="card-title">
        <span>Registered Autonomous Agents</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{agents.length} Online</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {agents.map((agent) => (
          <div key={agent._id || agent.name} style={{
            background: '#111726',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>{agent.name}</h4>
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(167, 139, 250, 0.2)',
                color: '#a78bfa',
                fontWeight: 600
              }}>
                {agent.role}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '10px 0' }}>
              {agent.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
              <span>Provider: <strong style={{ color: '#cbd5e1' }}>{agent.modelProvider}</strong></span>
              <span>Model: <strong style={{ color: '#cbd5e1' }}>{agent.modelName}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveAgentGrid;
