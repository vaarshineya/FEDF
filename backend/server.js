import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'fedf-backend' });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from FEDF backend!' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`FEDF backend running on port ${PORT}`);
});
