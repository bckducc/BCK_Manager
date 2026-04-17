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

export const requireLandlord = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthenticationError('Chưa được xác thực');
    }

    if (req.user.role !== 'landlord') {
      throw new AuthorizationError('Chỉ chủ nhà mới có quyền thực hiện tác vụ này');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireTenant = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthenticationError('Chưa được xác thực');
    }

    if (req.user.role !== 'tenant') {
      throw new AuthorizationError('Chỉ người thuê mới có quyền thực hiện tác vụ này');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkOwnershipOrLandlord = (paramName = 'id') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Chưa được xác thực');
      }

      if (req.user.role === 'landlord') {
        return next();
      }

      const resourceId = req.params[paramName];
      if (!resourceId) {
        throw new AuthorizationError('Tham số không hợp lệ');
      }

      if (req.user.id.toString() !== resourceId.toString()) {
        throw new AuthorizationError('Không có quyền truy cập tài nguyên này');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkInvoiceAccess = (invoiceModel) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Chưa được xác thực');
      }

      if (req.user.role === 'landlord') {
        return next();
      }

      const invoiceId = req.params.id;
      const invoice = await invoiceModel.findById(invoiceId);

      if (!invoice) {
        throw new AuthorizationError('Hóa đơn không tồn tại');
      }

      if (invoice.tenantId.toString() !== req.user.id.toString()) {
        throw new AuthorizationError('Không có quyền truy cập hóa đơn này');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkContractAccess = (contractModel) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Chưa được xác thực');
      }

      if (req.user.role === 'landlord') {
        return next();
      }

      const contractId = req.params.id;
      const contract = await contractModel.findById(contractId);

      if (!contract) {
        throw new AuthorizationError('Hợp đồng không tồn tại');
      }

      if (contract.tenantId.toString() !== req.user.id.toString()) {
        throw new AuthorizationError('Không có quyền truy cập hợp đồng này');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkRoomAccess = (roomModel, contractModel) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Chưa được xác thực');
      }

      if (req.user.role === 'landlord') {
        return next();
      }

      const roomId = req.params.id || req.params.roomId;
      const room = await roomModel.findById(roomId);

      if (!room) {
        throw new AuthorizationError('Phòng không tồn tại');
      }

      const contract = await contractModel.findOne({
        roomId: roomId,
        tenantId: req.user.id,
        status: 'active'
      });

      if (!contract) {
        throw new AuthorizationError('Không có quyền truy cập phòng này');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
