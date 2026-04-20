import { getBillsByUser, getBillById, createBill, updateBill, deleteBill } from './bill.service.js';
import { ApiResponse, sendResponse } from '../../utils/responseHandler.js';
import { NotFoundError, AuthorizationError } from '../../utils/customError.js';

export const getUserBills = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const bills = await getBillsByUser(userId, userRole);

    const response = ApiResponse.success(200, {
      bills,
      count: bills.length
    }, 'Lấy danh sách hóa đơn thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[GET_USER_BILLS] Error:', error.message);
    next(error);
  }
};

export const getBillDetail = async (req, res, next) => {
  try {
    const { billId } = req.params;

    const bill = await getBillById(billId);

    if (!bill) {
      throw new NotFoundError('Không tìm thấy hóa đơn');
    }

    const response = ApiResponse.success(200, bill, 'Lấy chi tiết hóa đơn thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[GET_BILL_DETAIL] Error:', error.message);
    next(error);
  }
};

export const createNewBill = async (req, res, next) => {
  try {
    const { roomId, amount, billType, dueDate, status, description } = req.body;

    const billData = {
      room_id: roomId,
      amount,
      bill_type: billType,
      due_date: dueDate,
      status: status || 'pending',
      description: description || null
    };

    const newBill = await createBill(billData);

    const response = ApiResponse.success(201, newBill, 'Tạo hóa đơn thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[CREATE_BILL] Error:', error.message);
    next(error);
  }
};

export const updateBillInfo = async (req, res, next) => {
  try {
    const { billId } = req.params;
    const { amount, status, dueDate, description } = req.body;

    const bill = await getBillById(billId);
    if (!bill) {
      throw new NotFoundError('Không tìm thấy hóa đơn');
    }

    const updateData = {};
    if (amount !== undefined) updateData.amount = amount;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.due_date = dueDate;
    if (description !== undefined) updateData.description = description;

    const updatedBill = await updateBill(billId, updateData);

    const response = ApiResponse.success(200, updatedBill, 'Cập nhật hóa đơn thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[UPDATE_BILL] Error:', error.message);
    next(error);
  }
};

export const deleteBillInfo = async (req, res, next) => {
  try {
    const { billId } = req.params;

    const bill = await getBillById(billId);
    if (!bill) {
      throw new NotFoundError('Không tìm thấy hóa đơn');
    }

    await deleteBill(billId);

    const response = ApiResponse.success(204, null, 'Xóa hóa đơn thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[DELETE_BILL] Error:', error.message);
    next(error);
  }
};
