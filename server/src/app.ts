import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import accountRoutes from './routes/account.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/accounts', accountRoutes);

export default app;
