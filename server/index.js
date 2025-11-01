const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(express.json());

// Simple CORS for demo
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Upload endpoint (accepts text file or PDF in prod)
app.post('/api/upload', upload.single('policy'), async (req, res) => {
  // For demo we accept plain text upload and return a "policyId"
  if (!req.file) return res.status(400).json({ error: 'no file' });
  const dest = path.join(__dirname, 'uploads', req.file.originalname);
  fs.renameSync(req.file.path, dest);
  // In prod: upload to Spaces and index into vector store.
  return res.json({ policyId: req.file.originalname });
});

// Ask endpoint proxies to LLM service
app.post('/api/ask', async (req, res) => {
  const { question, policyId } = req.body;
  if (!question || !policyId) return res.status(400).json({ error: 'question and policyId required' });

  const LLM_URL = process.env.LLM_SERVICE_URL || 'http://localhost:8000/qa';
  try {
    const r = await fetch(LLM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, policyId })
    });
    const data = await r.json();
    return res.json(data);
  } catch (e) {
    console.error('llm proxy error', e);
    return res.status(500).json({ error: 'LLM service unreachable', detail: String(e) });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server listening on', PORT));
