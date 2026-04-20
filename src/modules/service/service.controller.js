/**
 * Service Module - Controller Layer
 */

import { getServices, getServiceById, createService, updateService, deleteService } from './service.service.js';
import { ApiResponse, sendResponse } from '../../utils/responseHandler.js';
import { NotFoundError } from '../../utils/customError.js';

export const getAllServices = async (req, res, next) => {
  try {
    const services = await getServices();

    const response = ApiResponse.success(200, {
      services,
      count: services.length
    }, 'Lấy danh sách dịch vụ thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[GET_ALL_SERVICES] Error:', error.message);
    next(error);
  }
};

export const getServiceDetail = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const service = await getServiceById(serviceId);

    if (!service) {
      throw new NotFoundError('Không tìm thấy dịch vụ');
    }

    const response = ApiResponse.success(200, service, 'Lấy chi tiết dịch vụ thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[GET_SERVICE_DETAIL] Error:', error.message);
    next(error);
  }
};

export const createNewService = async (req, res, next) => {
  try {
    const { serviceName, description, price } = req.body;

    const serviceData = {
      service_name: serviceName,
      description: description || null,
      price
    };

    const newService = await createService(serviceData);

    const response = ApiResponse.success(201, newService, 'Tạo dịch vụ thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[CREATE_SERVICE] Error:', error.message);
    next(error);
  }
};

export const updateServiceInfo = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { serviceName, description, price } = req.body;

    const service = await getServiceById(serviceId);
    if (!service) {
      throw new NotFoundError('Không tìm thấy dịch vụ');
    }

    const updateData = {};
    if (serviceName !== undefined) updateData.service_name = serviceName;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;

    const updatedService = await updateService(serviceId, updateData);

    const response = ApiResponse.success(200, updatedService, 'Cập nhật dịch vụ thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[UPDATE_SERVICE] Error:', error.message);
    next(error);
  }
};

export const deleteServiceInfo = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const service = await getServiceById(serviceId);
    if (!service) {
      throw new NotFoundError('Không tìm thấy dịch vụ');
    }

    await deleteService(serviceId);

    const response = ApiResponse.success(204, null, 'Xóa dịch vụ thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[DELETE_SERVICE] Error:', error.message);
    next(error);
  }
};
