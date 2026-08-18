import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: 'Servifio API is healthy',
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'connected',
      },
    });
  } catch {
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

export default router;
