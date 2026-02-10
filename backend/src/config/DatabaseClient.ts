import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseClient {
  private static instance: DatabaseClient;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) return;

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/genz_fashion';
    
    try {
      await mongoose.connect(uri);
      this.isConnected = true;
      console.log('Successfully connected to MongoDB.');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    await mongoose.disconnect();
    this.isConnected = false;
    console.log('Disconnected from MongoDB.');
  }
}

export default DatabaseClient;
