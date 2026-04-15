import { findUserByUsername, getUserWithLandlordInfo, getUserWithTenantInfo, validatePassword } from '../services/authService.js';
import { generateToken } from '../middleware/auth.js';
import { ApiResponse, sendResponse } from '../utils/responseHandler.js';
import { AuthenticationError, NotFoundError, AuthorizationError, ValidationError } from '../utils/customError.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    console.log(`[LOGIN] Attempt: ${username}`);

    const user = await findUserByUsername(username);

    if (!user) {
      console.log(`[LOGIN] User not found: ${username}`);
      throw new AuthenticationError('Tên tài khoản hoặc mật khẩu không chính xác');
    }

    if (!user.is_active) {
      throw new AuthenticationError('Tài khoản đã bị vô hiệu hóa');
    }

    const passwordMatch = password === user.password;
    if (!passwordMatch) {
      console.log(`[LOGIN] Password mismatch: ${username}`);
      throw new AuthenticationError('Tên tài khoản hoặc mật khẩu không chính xác');
    }

    let userWithInfo;
    
    if (user.role === 'landlord') {
      userWithInfo = await getUserWithLandlordInfo(user.id);
      if (!userWithInfo) {
        throw new NotFoundError('Thông tin chủ nhà không tìm thấy');
      }
    } else if (user.role === 'tenant') {
      userWithInfo = await getUserWithTenantInfo(user.id);
      if (!userWithInfo) {
        throw new NotFoundError('Thông tin người thuê không tìm thấy');
      }
    } else {
      throw new AuthorizationError('Vai trò người dùng không hợp lệ');
    }

    const token = generateToken(user.id, user.username, user.role);

    console.log(`[LOGIN] Success: ${username}`);

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: userWithInfo.id,
        username: userWithInfo.username,
        role: userWithInfo.role,
        fullName: userWithInfo.full_name || 'Unknown',
        email: userWithInfo.email || `${userWithInfo.username}@${user.role}.local`,
        phone: userWithInfo.phone || '',
        identityCard: userWithInfo.identity_card || null,
        gender: userWithInfo.gender || null,
        birthday: userWithInfo.birthday || null,
        landlord_id: userWithInfo.landlord_id || null,
        createdAt: userWithInfo.created_at,
      },
    });
  } catch (error) {
    console.error('[LOGIN] Error:', error.message);
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let userWithInfo;
    
    if (userRole === 'landlord') {
      userWithInfo = await getUserWithLandlordInfo(userId);
    } else if (userRole === 'tenant') {
      userWithInfo = await getUserWithTenantInfo(userId);
    } else {
      throw new AuthorizationError('Vai trò người dùng không hợp lệ');
    }

    if (!userWithInfo) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }

    const response = ApiResponse.success(200, {
      id: userWithInfo.id,
      username: userWithInfo.username,
      role: userWithInfo.role,
      fullName: userWithInfo.full_name,
      email: userWithInfo.email || `${userWithInfo.username}@${userRole}.local`,
      phone: userWithInfo.phone,
      identityCard: userWithInfo.identity_card || null,
      gender: userWithInfo.gender || null,
      birthday: userWithInfo.birthday || null,
      createdAt: userWithInfo.created_at,
    }, 'Lấy thông tin người dùng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[ME] Error:', error.message);
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    const response = ApiResponse.success(200, null, 'Đăng xuất thành công');
    return sendResponse(res, response);
  } catch (error) {
    console.error('[LOGOUT] Error:', error.message);
    next(error);
  }
};

export const checkUser = async (req, res, next) => {
  try {
    const { username } = req.query;

    if (!username || username.trim() === '') {
      throw new ValidationError('Tên tài khoản là bắt buộc');
    }

    const user = await findUserByUsername(username);

    if (!user) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }

    const response = ApiResponse.success(200, {
      id: user.id,
      username: user.username,
      role: user.role,
      isActive: user.is_active,
    }, 'Tìm thấy người dùng');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[CHECK_USER] Error:', error.message);
    next(error);
  }
};
