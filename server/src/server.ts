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

    // Uncomment in development to auto-sync schema (use migrations in production)
    // await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
