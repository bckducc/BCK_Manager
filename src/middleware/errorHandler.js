import { ApiResponse } from '../utils/responseHandler.js';
import { AppError } from '../utils/customError.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.statusCode, err.message, err)
    );
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      ApiResponse.error(401, 'Token không hợp lệ')
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      ApiResponse.error(401, 'Token đã hết hạn')
    );
  }

  if (err.isJoi || err.status === 400) {
    return res.status(400).json(
      ApiResponse.error(400, 'Dữ liệu không hợp lệ', err)
    );
  }

  return res.status(err.statusCode || 500).json(
    ApiResponse.error(
      err.statusCode || 500,
      err.message || 'Lỗi server nội bộ',
      err
    )
  );
};

export const notFoundHandler = (req, res) => {
  return res.status(404).json(
    ApiResponse.error(404, `Route không tồn tại: ${req.originalUrl}`)
  );
};
