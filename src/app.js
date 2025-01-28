import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';
import { ReadableStream } from 'stream/web'; // Import ReadableStream

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Contoh penggunaan ReadableStream
app.get('/stream', (req, res) => {
  const text = "Hello, this is a stream of data!";
  
  // Membuat ReadableStream
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(text);
      controller.close();
    }
  });

  // Menyampaikan stream ke klien
  res.setHeader('Content-Type', 'text/plain');
  const reader = stream.getReader();
  const encoder = new TextEncoder();
  
  reader.read().then(({ value, done }) => {
    if (!done) {
      res.write(encoder.encode(value));
    }
    res.end();
  });
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
