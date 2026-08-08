import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import serviceRoutes from './routes/service.routes';
import bookingRoutes from './routes/booking.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Servifio server is running',
  });
});

export default app;
