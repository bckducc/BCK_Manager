/**
 * Service Module Validation Rules
 */

export const serviceValidationRules = {
  createService: {
    serviceName: 'required|string|max:100',
    description: 'string|max:1000',
    price: 'required|number|min:0'
  },

  updateService: {
    serviceName: 'string|max:100',
    description: 'string|max:1000',
    price: 'number|min:0'
  }
};
