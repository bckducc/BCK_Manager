import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Import module routes
import authRoutes from './modules/auth/auth.route.js';
import tenantRoutes from './modules/tenant/tenant.route.js';
import roomRoutes from './modules/room/room.route.js';
import billRoutes from './modules/bill/bill.route.js';
import serviceRoutes from './modules/service/service.route.js';
import contractRoutes from './modules/contract/contract.route.js';
// Import middleware and utilities
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { ApiResponse } from './utils/responseHandler.js';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json(
    ApiResponse.success(200, {
      status: 'OK',
      environment: process.env.NODE_ENV || 'development',
    }, 'Server đang chạy')
  );
});

const apiV1 = express.Router();

// Register module routes
apiV1.use('/auth', authRoutes);
apiV1.use('/tenant', tenantRoutes);
apiV1.use('/rooms', roomRoutes);
apiV1.use('/bills', billRoutes);
apiV1.use('/services', serviceRoutes);
apiV1.use('/contracts', contractRoutes);

app.use('/api', apiV1);

app.use(notFoundHandler);

app.use(errorHandler);

const server = app.listen(PORT, async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Database connected successfully');
    connection.release();

    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API Base URL: http://localhost:${PORT}/api`);
    console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error('✗ Failed to connect to database:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
