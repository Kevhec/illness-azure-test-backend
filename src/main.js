import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import generateContainerSasTokenURL from './azure/blobClient.js';
import analyzeImage from './azure/visionAnalysis.js';
import cors from 'cors'

dotenv.config();

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the allowed origin pattern for localhost on any port
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    // Check if the origin starts with 'http://localhost'
    if (origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Use the cors middleware with the specified options
app.use(cors(corsOptions));

app.get('/api/getsasurl', (req, res) => {
  const url = generateContainerSasTokenURL();

  res.json({ sasUrl: url })
})

app.post('/api/getillness', async (req, res) => {
  const url = req.body.url;

  const illnessData = await analyzeImage(url);

  return res.json({results: illnessData})
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
