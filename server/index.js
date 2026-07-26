const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SAP Copilot Express API Server is healthy' });
});

app.listen(PORT, () => {
  console.log(`🚀 SAP Copilot Express Server running on http://localhost:${PORT}`);
});
