import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;
const DATA_FILE = './data.json';

let messages = [];

// Middleware
app.use(cors());
app.use(express.json());

// Load existing confessions
try {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  messages = JSON.parse(data);
} catch {
  messages = [];
}

// GET all confessions
app.get('/messages', (req, res) => {
  res.json(messages);
});

// POST a new confession
app.post('/messages', (req, res) => {
  const text = req.body.text;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text is required' });
  }

  const newMsg = {
    id: Date.now(),
    text: text.trim()
  };

  messages.push(newMsg); // ✅ now stores all confessions
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));

  res.status(201).json(newMsg);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
