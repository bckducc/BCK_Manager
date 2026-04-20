import { getTenantByUserId, updateTenantProfile, getTenantRooms } from './tenant.service.js';
import { getUserWithTenantInfo } from '../auth/auth.service.js';
import { ApiResponse, sendResponse } from '../../utils/responseHandler.js';
import { NotFoundError } from '../../utils/customError.js';

export const getTenantDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const tenantInfo = await getUserWithTenantInfo(userId);

    if (!tenantInfo) {
      throw new NotFoundError('Không tìm thấy thông tin người thuê');
    }

    const response = ApiResponse.success(200, {
      profile: {
        id: tenantInfo.id,
        username: tenantInfo.username,
        fullName: tenantInfo.full_name,
        phone: tenantInfo.phone,
        identityCard: tenantInfo.identity_card,
        birthday: tenantInfo.birthday,
        gender: tenantInfo.gender,
        address: tenantInfo.address,
        createdAt: tenantInfo.created_at,
      },
      dashboard: {
        role: 'tenant',
        status: 'active',
      },
    }, 'Lấy dashboard thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[GET_TENANT_DASHBOARD] Error:', error.message);
    next(error);
  }
};

export const updateTenantProfileController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, identityCard, birthday, gender, address } = req.body;

    const profileData = {
      full_name: fullName,
      phone: phone,
      identity_card: identityCard,
      birthday: birthday,
      gender: gender,
      address: address
    };

    await updateTenantProfile(userId, profileData);

    const response = ApiResponse.success(200, {
      id: userId,
      fullName,
      phone,
      identityCard,
      birthday,
      gender,
      address,
    }, 'Cập nhật thông tin thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[UPDATE_TENANT_PROFILE] Error:', error.message);
    next(error);
  }
};

export const getTenantRoomsController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const tenant = await getTenantByUserId(userId);
    if (!tenant) {
      throw new NotFoundError('Không tìm thấy thông tin người thuê');
    }

    const rooms = await getTenantRooms(tenant.id);

    const response = ApiResponse.success(200, {
      rooms,
      count: rooms.length
    }, 'Lấy danh sách phòng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[GET_TENANT_ROOMS] Error:', error.message);
    next(error);
  }
};
