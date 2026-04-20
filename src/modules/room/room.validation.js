/**
 * Room Module Validation Rules
 */

export const roomValidationRules = {
  createRoom: {
    roomNumber: 'required|string|max:20',
    floor: 'required|number|min:0',
    area: 'required|number|min:0',
    price: 'required|number|min:0',
    status: "in:available,rented,maintenance",
    description: 'string'
  },

  updateRoom: {
    roomNumber: 'string|max:20',
    floor: 'number|min:0',
    area: 'number|min:0',
    price: 'number|min:0',
    status: "in:available,rented,maintenance",
    description: 'string'
  }
};
