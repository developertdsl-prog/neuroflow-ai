import React from 'react';

const ExecutionLogsTerminal = ({ logs }) => {
  const sampleLogs = logs && logs.length > 0 ? logs : [
    { time: '18:24:01', level: 'INFO', msg: '[DAG] Kahn topological sort completed: 5 stages planned' },
    { time: '18:24:02', level: 'INFO', msg: '[SecurityGuardrail] Content scanned: 0 injection attacks detected' },
    { time: '18:24:03', level: 'DEBUG', msg: '[VectorMemory] Cosine top-5 neighbors recalled for prompt query' },
    { time: '18:24:04', level: 'INFO', msg: '[ToolExecutor] Sandboxed calculator evaluated arithmetic expression' },
    { time: '18:24:05', level: 'SUCCESS', msg: '[WorkflowExecution] Completed DAG run wf-live-8831 in 482ms' }
  ];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-title">
        <span>Live Agent Mesh Terminal</span>
        <span style={{ fontSize: '0.75rem', color: '#10b981', fontFamily: 'JetBrains Mono' }}>● STREAMING</span>
      </div>

      <div style={{
        background: '#090c13',
        border: '1px solid #1a2235',
        borderRadius: '8px',
        padding: '14px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.75rem',
        maxHeight: '260px',
        overflowY: 'auto',
        color: '#94a3b8'
      }}>
        {sampleLogs.map((log, idx) => (
          <div key={idx} style={{ marginBottom: '6px', lineHeight: '1.4' }}>
            <span style={{ color: '#64748b' }}>[{log.time}]</span>{' '}
            <span style={{
              color: log.level === 'SUCCESS' ? '#10b981' : log.level === 'INFO' ? '#38bdf8' : '#e2e8f0',
              fontWeight: 600
            }}>
              [{log.level}]
            </span>{' '}
            <span style={{ color: '#f1f5f9' }}>{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionLogsTerminal;
