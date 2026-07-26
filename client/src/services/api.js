const API_BASE = '/api';

export async function sendChatMessage(question) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  if (!res.ok) throw new Error('Chat API failed');
  return res.json();
}

export async function simulateVkoa(data) {
  const res = await fetch(`${API_BASE}/vkoa/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('VKOA Simulation API failed');
  return res.json();
}

export async function simulateObyc(data) {
  const res = await fetch(`${API_BASE}/obyc/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('OBYC Simulation API failed');
  return res.json();
}

export async function generateSpec(data) {
  const res = await fetch(`${API_BASE}/spec/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Spec Generation API failed');
  return res.json();
}

export async function fetchErrors() {
  const res = await fetch(`${API_BASE}/errors`);
  if (!res.ok) throw new Error('Error DB API failed');
  return res.json();
}

export async function fetchAcdocaInfo() {
  const res = await fetch(`${API_BASE}/tables/acdoca`);
  if (!res.ok) throw new Error('ACDOCA API failed');
  return res.json();
}
