/**
 * Contract Module Validation Rules
 */

export const contractValidationRules = {
  createContract: {
    roomId: 'required|number|min:1',
    tenantId: 'required|number|min:1',
    startDate: 'required|date',
    endDate: 'required|date',
    monthlyRent: 'required|number|min:0',
    status: 'in:active,terminated,expired',
    description: 'string'
  },

  updateContract: {
    endDate: 'date',
    monthlyRent: 'number|min:0',
    status: 'in:active,terminated,expired',
    description: 'string'
  }
};
