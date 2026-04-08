import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from '../utils/customError.js';

export const generateToken = (userId, username, role) => {
  return jwt.sign(
    { id: userId, username, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('[TOKEN_VERIFICATION] Error:', error.message);
    return null;
  }
};

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('Không có token được cung cấp');
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      throw new AuthenticationError('Token không hợp lệ hoặc đã hết hạn');
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Chưa được xác thực');
      }

      const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      if (!rolesArray.includes(req.user.role)) {
        throw new AuthorizationError('Không có quyền truy cập tài nguyên này');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
