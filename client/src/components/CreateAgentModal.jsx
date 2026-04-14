import React, { useState } from 'react';

const CreateAgentModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'EXECUTOR',
    modelProvider: 'OPENAI',
    modelName: 'gpt-4o',
    description: '',
    systemPrompt: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
        <div className="card-title">
          <span>Deploy New Autonomous Agent</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Agent Name</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', background: '#0e121d', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              placeholder="e.g. ComplianceAuditor"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', background: '#0e121d', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
            >
              <option value="COORDINATOR">COORDINATOR</option>
              <option value="RESEARCHER">RESEARCHER</option>
              <option value="ARCHITECT">ARCHITECT</option>
              <option value="EXECUTOR">EXECUTOR</option>
              <option value="SECURITY_AUDITOR">SECURITY_AUDITOR</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Model Provider</label>
            <select
              value={formData.modelProvider}
              onChange={(e) => setFormData({ ...formData, modelProvider: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', background: '#0e121d', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
            >
              <option value="OPENAI">OpenAI (GPT-4o)</option>
              <option value="ANTHROPIC">Anthropic (Claude 3.5 Sonnet)</option>
              <option value="GEMINI">Google (Gemini 1.5 Pro)</option>
              <option value="LOCAL_LLAMA">Local (Llama-3 70B)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Role Description</label>
            <input
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', background: '#0e121d', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              placeholder="Primary responsibilities..."
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>System Prompt Instruction</label>
            <textarea
              required
              rows={3}
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', background: '#0e121d', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
              placeholder="You are an autonomous AI agent specializing in..."
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            Deploy Agent to Mesh
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAgentModal;
