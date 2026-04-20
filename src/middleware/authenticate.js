import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'SECRET_KEY';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Chưa đăng nhập - Token không tìm thấy'
      });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    try {
      const decoded = jwt.verify(token, SECRET);
      req.user = decoded; 
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token đã hết hạn'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực'
    });
  }
};

export default authenticate;
