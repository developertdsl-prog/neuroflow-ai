import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'neuroflow_live_auth_secret_token_9941'
  }
});

export const fetchSummary = async () => {
  const res = await apiClient.get('/analytics/summary');
  return res.data;
};

export const fetchAgents = async () => {
  const res = await apiClient.get('/agents');
  return res.data;
};

export const createAgent = async (agentData) => {
  const res = await apiClient.post('/agents', agentData);
  return res.data;
};

export const fetchGuardrails = async () => {
  const res = await apiClient.get('/guardrails');
  return res.data;
};

export default apiClient;
