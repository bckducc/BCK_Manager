import { ValidationError } from '../utils/customError.js';

export const validateFields = (rules) => {
  return (req, res, next) => {
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body[field];
      const ruleArray = rule.split('|');

      for (const ruleItem of ruleArray) {
        if (ruleItem === 'required' && (!value || value.trim() === '')) {
          errors[field] = `${field} là bắt buộc`;
          break;
        }

        if (ruleItem === 'string' && value && typeof value !== 'string') {
          errors[field] = `${field} phải là chuỗi`;
          break;
        }

        if (ruleItem === 'number' && value && isNaN(value)) {
          errors[field] = `${field} phải là số`;
          break;
        }

        if (ruleItem.startsWith('min:')) {
          const min = parseInt(ruleItem.split(':')[1]);
          if (value && value.length < min) {
            errors[field] = `${field} phải có ít nhất ${min} ký tự`;
            break;
          }
        }

        if (ruleItem.startsWith('max:')) {
          const max = parseInt(ruleItem.split(':')[1]);
          if (value && value.length > max) {
            errors[field] = `${field} không được vượt quá ${max} ký tự`;
            break;
          }
        }

        if (ruleItem === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[field] = `${field} không hợp lệ`;
          break;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(JSON.stringify(errors));
    }

    next();
  };
};

export const validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id || isNaN(id)) {
      throw new ValidationError(`${paramName} không hợp lệ`);
    }

    next();
  };
};
