import express from 'express';
import apiRoute, { apiProtected } from './routes/api.js';
import mongoose from 'mongoose';
import { DB_CONNECT } from './utils/constants.js';
import AuthMiddleware from './middlewares/AuthMiddleware.js';
import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config(); 

const app = express();

const PORT = 8000;


async function connectToDatabase() {
  try {
    await mongoose.connect(DB_CONNECT, { useNewUrlParser: true });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

connectToDatabase();

app.use(cors())
app.use(express.json())
app.use('/api/',apiRoute)
app.use('/api/',AuthMiddleware, apiProtected)

app.listen(PORT,()=> console.log('server is running'))

