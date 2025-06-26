import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;
const DATA_FILE = './data.json';

let messages = [];

// Middleware
app.use(cors());         // Allow requests from frontend
app.use(express.json()); // Parse JSON body

// Load existing message(s) from file
try {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  messages = JSON.parse(data);
} catch (error) {
  messages = [];
  console.error('Error loading data.json:', error.message);
}

// Get current message(s)
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Add a new confession (and clear all previous)
app.post('/messages', (req, res) => {
  const text = req.body.text;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text is required' });
  }

  const newMsg = {
    id: Date.now(),
    text: text.trim()
  };

  // Overwrite all previous messages
  messages = [newMsg];
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));

  res.status(201).json(newMsg);
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
