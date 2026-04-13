import React from 'react';

const GuardrailRulesView = ({ rules }) => {
  const activeRules = rules && rules.length > 0 ? rules : [
    { name: 'Anti-Prompt-Injection', category: 'PROMPT_INJECTION', action: 'BLOCK', severity: 'CRITICAL' },
    { name: 'PII-Email-Anonymizer', category: 'PII_LEAK', action: 'REDACT', severity: 'HIGH' },
    { name: 'API-Key-Shield', category: 'PII_LEAK', action: 'REDACT', severity: 'HIGH' },
    { name: 'System-Command-Blocker', category: 'UNAUTHORIZED_TOOL', action: 'BLOCK', severity: 'CRITICAL' }
  ];

  return (
    <div className="card">
      <div className="card-title">
        <span>Zero-Trust Guardrail Rules</span>
        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>Active</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {activeRules.map((rule, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: '#0d121f',
            border: '1px solid var(--border-color)',
            borderRadius: '6px'
          }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{rule.name}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rule.category}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '4px',
                background: rule.action === 'BLOCK' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: rule.action === 'BLOCK' ? '#ef4444' : '#f59e0b',
                fontWeight: 700
              }}>
                {rule.action}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuardrailRulesView;
