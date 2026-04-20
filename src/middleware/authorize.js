import { ROLES, ROLE_PERMISSIONS } from '../constants/roles.js';

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa đăng nhập'
      });
    }

    const userRole = req.user.role?.toLowerCase();
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Không có quyền truy cập. Yêu cầu vai trò: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

export const permission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa đăng nhập'
      });
    }

    const userRole = req.user.role?.toLowerCase();
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasPermission = requiredPermissions.some(perm => 
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Không đủ quyền để thực hiện hành động này'
      });
    }

    next();
  };
};

export const ownerOrAdmin = (resourceOwnerIdField = 'tenant_id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Chưa đăng nhập'
        });
      }

      const userRole = req.user.role?.toLowerCase();
      
      // Landlord có quyền truy cập tất cả
      if (userRole === ROLES.LANDLORD) {
        return next();
      }

      const resourceOwnerId = req.body[resourceOwnerIdField] || req.params[resourceOwnerIdField];
      
      if (resourceOwnerId && parseInt(resourceOwnerId) !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Bạn chỉ có thể truy cập dữ liệu của chính mình'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi kiểm tra quyền'
      });
    }
  };
};

export default { authorize, permission, ownerOrAdmin };
