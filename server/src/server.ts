import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import sequelize from './config/connection';
import { initializeModels } from './models';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database authenticated');

    await initializeModels();
    console.log('Models initialized with associations');

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
