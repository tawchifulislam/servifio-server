import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Servifio server is running',
  });
});

export default app;
