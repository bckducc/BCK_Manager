export const billValidationRules = {
  createBill: {
    roomId: 'required|number|min:1',
    amount: 'required|number|min:0',
    billType: 'required|in:rent,utilities,service,other',
    dueDate: 'required|date',
    status: 'in:pending,paid,overdue',
    description: 'string'
  },

  updateBill: {
    amount: 'number|min:0',
    billType: 'in:rent,utilities,service,other',
    dueDate: 'date',
    status: 'in:pending,paid,overdue',
    description: 'string'
  }
};
