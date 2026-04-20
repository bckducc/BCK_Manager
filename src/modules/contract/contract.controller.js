/**
 * Contract Module - Controller Layer
 */

import { getContractsByUser, getContractById, createContract, updateContract, deleteContract } from './contract.service.js';
import { ApiResponse, sendResponse } from '../../utils/responseHandler.js';
import { NotFoundError, AuthorizationError } from '../../utils/customError.js';

export const getUserContracts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const contracts = await getContractsByUser(userId, userRole);

    const response = ApiResponse.success(200, {
      contracts,
      count: contracts.length
    }, 'Lấy danh sách hợp đồng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[GET_USER_CONTRACTS] Error:', error.message);
    next(error);
  }
};

export const getContractDetail = async (req, res, next) => {
  try {
    const { contractId } = req.params;

    const contract = await getContractById(contractId);

    if (!contract) {
      throw new NotFoundError('Không tìm thấy hợp đồng');
    }

    const response = ApiResponse.success(200, contract, 'Lấy chi tiết hợp đồng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[GET_CONTRACT_DETAIL] Error:', error.message);
    next(error);
  }
};

export const createNewContract = async (req, res, next) => {
  try {
    const { roomId, tenantId, startDate, endDate, monthlyRent, status, description } = req.body;

    const contractData = {
      room_id: roomId,
      tenant_id: tenantId,
      start_date: startDate,
      end_date: endDate,
      monthly_rent: monthlyRent,
      status: status || 'active',
      description: description || null
    };

    const newContract = await createContract(contractData);

    const response = ApiResponse.success(201, newContract, 'Tạo hợp đồng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[CREATE_CONTRACT] Error:', error.message);
    next(error);
  }
};

export const updateContractInfo = async (req, res, next) => {
  try {
    const { contractId } = req.params;
    const { endDate, monthlyRent, status, description } = req.body;

    const contract = await getContractById(contractId);
    if (!contract) {
      throw new NotFoundError('Không tìm thấy hợp đồng');
    }

    const updateData = {};
    if (endDate !== undefined) updateData.end_date = endDate;
    if (monthlyRent !== undefined) updateData.monthly_rent = monthlyRent;
    if (status !== undefined) updateData.status = status;
    if (description !== undefined) updateData.description = description;

    const updatedContract = await updateContract(contractId, updateData);

    const response = ApiResponse.success(200, updatedContract, 'Cập nhật hợp đồng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[UPDATE_CONTRACT] Error:', error.message);
    next(error);
  }
};

export const deleteContractInfo = async (req, res, next) => {
  try {
    const { contractId } = req.params;

    const contract = await getContractById(contractId);
    if (!contract) {
      throw new NotFoundError('Không tìm thấy hợp đồng');
    }

    await deleteContract(contractId);

    const response = ApiResponse.success(204, null, 'Xóa hợp đồng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[DELETE_CONTRACT] Error:', error.message);
    next(error);
  }
};
