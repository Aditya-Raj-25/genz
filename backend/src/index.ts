import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import DatabaseClient from './config/DatabaseClient';
import router from './routes';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
app.options('*', cors()); // Handle preflight for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to DB and export app for Vercel serverless
let isConnected = false;

const connectDB = async () => {
  if (!isConnected) {
    const dbClient = DatabaseClient.getInstance();
    await dbClient.connect();
    isConnected = true;
  }
};

// For Vercel serverless - connect on each cold start
connectDB().catch(console.error);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
