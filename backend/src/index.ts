import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import DatabaseClient from './config/DatabaseClient';
import router from './routes';
import { ImportService } from './services/ImportService';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  try {
    const dbClient = DatabaseClient.getInstance();
    await dbClient.connect();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Check if we need to import data
    if (process.env.IMPORT_DATA === 'true') {
      console.log('Starting data import from CSV...');
      const importService = new ImportService();
      const csvPath = path.join(__dirname, '../../genz.csv');
      const result = await importService.importFromCSV(csvPath);
      console.log(`Import completed: ${result.count} products processed.`);
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
