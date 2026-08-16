import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import userManagementRoutes from './routes/user-management.routes';
import categoryRoutes from './routes/category.routes';
import serviceRoutes from './routes/service.routes';
import bookingRoutes from './routes/booking.routes';
import reviewRoutes from './routes/review.routes';
import { notFoundHandler, globalErrorHandler } from './lib/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/users', userManagementRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Servifio server is running',
  });
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
