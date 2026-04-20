export const authValidationRules = {
  login: {
    username: 'required|string|min:3|max:50',
    password: 'required|string|min:5|max:255'
  },
  
  checkUser: {
    username: 'required|string|min:3|max:50'
  },

  registerUser: {
    username: 'required|string|min:3|max:50|unique:users',
    password: 'required|string|min:5|max:255',
    role: "required|in:landlord,tenant"
  }
};
