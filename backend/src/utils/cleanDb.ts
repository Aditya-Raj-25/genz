import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const clean = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/genz_fashion');
  console.log('Connected to DB');
  try {
    await mongoose.connection.db?.dropCollection('products');
    console.log('Dropped products collection');
  } catch (e) {
    console.log('Collection might not exist');
  }
  await mongoose.disconnect();
  process.exit(0);
};

clean();
