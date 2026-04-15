import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import tenantRoutes from './routes/tenant.js';
import roomRoutes from './routes/rooms.js';
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

apiV1.use('/auth', authRoutes);
apiV1.use('/tenant', tenantRoutes);
apiV1.use('/rooms', roomRoutes);

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
