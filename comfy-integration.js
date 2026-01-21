// Simple ComfyUI integration for RezStack
import fetch from 'node-fetch';

export async function generateImage(prompt, options = {}) {
  const {
    width = 512,
    height = 512,
    steps = 20,
    cfg = 7
  } = options;
  
  // Call ComfyUI directly
  const workflow = createWorkflow(prompt, { width, height, steps, cfg });
  
  const response = await fetch('http://127.0.0.1:8188/prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: workflow })
  });
  
  const result = await response.json();
  return result.prompt_id;
}

function createWorkflow(prompt, options) {
  // Same workflow structure as bridge.js
  return {
    "3": { /* KSampler */ },
    "4": { /* Checkpoint */ },
    // ... etc
  };
}