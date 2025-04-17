const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.post('/api/login', (req, res) => {
  res.json({ message: '✅ CORS is working from minimal server' });
});

app.listen(5000, () => {
  console.log('✅ Minimal Server running on http://localhost:5000');
});
