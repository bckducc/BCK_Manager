/**
 * Tenant Module Validation Rules
 */

export const tenantValidationRules = {
  updateProfile: {
    fullName: 'string|max:100',
    phone: 'string|min:10|max:20',
    identityCard: 'string|max:20',
    birthday: 'date',
    gender: "in:M,F,Other",
    address: 'string|max:255'
  }
};
