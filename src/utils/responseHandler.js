export class ApiResponse {
  static success(statusCode = 200, data = null, message = 'Thành công') {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(statusCode = 500, message = 'Lỗi server nội bộ', error = null) {
    const response = {
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === 'development' && error) {
      response.error = {
        message: error.message,
        stack: error.stack,
      };
    }

    return response;
  }

  static paginated(statusCode = 200, data = [], page = 1, limit = 10, total = 0, message = 'Thành công') {
    return {
      success: true,
      statusCode,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export const sendResponse = (res, response) => {
  return res.status(response.statusCode).json(response);
};
