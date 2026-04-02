import { findUserByUsername, getUserWithLandlordInfo, validatePassword } from '../services/authService.js';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tên tài khoản và mật khẩu là bắt buộc',
      });
    }

    console.log(`Login attempt: ${username}`); // Debug

    // Find user
    const user = await findUserByUsername(username);

    if (!user) {
      console.log(`User not found: ${username}`); // Debug
      return res.status(401).json({
        success: false,
        message: 'Tên tài khoản hoặc mật khẩu không chính xác',
      });
    }

    console.log(`User found: ${user.username}`); // Debug

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa',
      });
    }

    // Validate password (comparing plain text for now, should be hashed in production)
    // TODO: Hash passwords in database and use bcrypt comparison
    const passwordMatch = password === user.password;

    if (!passwordMatch) {
      console.log(`Password mismatch for user: ${username}`); // Debug
      return res.status(401).json({
        success: false,
        message: 'Tên tài khoản hoặc mật khẩu không chính xác',
      });
    }

    // Check if landlord role
    if (user.role !== 'landlord') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ chủ nhà mới có thể truy cập',
      });
    }

    // Get landlord info
    const userWithLandlordInfo = await getUserWithLandlordInfo(user.id);

    if (!userWithLandlordInfo) {
      console.log(`Landlord info not found for user id: ${user.id}`); // Debug
      return res.status(404).json({
        success: false,
        message: 'Thông tin chủ nhà không tìm thấy',
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.username, user.role);

    console.log(`Login successful for user: ${username}`); // Debug

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: userWithLandlordInfo.id,
        username: userWithLandlordInfo.username,
        role: userWithLandlordInfo.role,
        name: userWithLandlordInfo.full_name || 'Unknown',
        email: `${userWithLandlordInfo.username}@landlord.local`,
        phone: userWithLandlordInfo.phone || '',
        address: null,
        idNumber: null,
        gender: null,
        createdAt: userWithLandlordInfo.created_at,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message, error.stack); // Better debugging
    return res.status(500).json({
      success: false,
      message: error.message || 'Đăng nhập thất bại',
    });
  }
};

export const me = async (req, res) => {
  try {
    const userId = req.user.id;
    const userWithLandlordInfo = await getUserWithLandlordInfo(userId);

    if (!userWithLandlordInfo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userWithLandlordInfo.id,
        username: userWithLandlordInfo.username,
        role: userWithLandlordInfo.role,
        name: userWithLandlordInfo.full_name,
        email: `${userWithLandlordInfo.username}@landlord.local`,
        phone: userWithLandlordInfo.phone,
        address: null,
        idNumber: null,
        gender: null,
        createdAt: userWithLandlordInfo.created_at,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lấy thông tin người dùng thất bại',
      error: error.message,
    });
  }
};

export const logout = (req, res) => {
  try {
    // JWT is stateless, logout is handled on client side by removing token
    return res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Đăng xuất thất bại',
      error: error.message,
    });
  }
};

export const checkUser = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Tên tài khoản là bắt buộc',
      });
    }

    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error checking user:', error);
    return res.status(500).json({
      success: false,
      message: 'Kiểm tra người dùng thất bại',
      error: error.message,
    });
  }
};
