import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import router from './router';
import dotenv from 'dotenv';
import connectDB from './loaders/mongoDB';

dotenv.config();
connectDB();
const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
});

export default app;
