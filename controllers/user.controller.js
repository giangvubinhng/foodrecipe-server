const userService = require('../services/user.service');

async function register(req, res){

  const userRegisterRequestObject = req.body;
  const action = await userService.register(userRegisterRequestObject);
  return res.status(action.status).json(action.result);
}

async function login(req, res){

}

async function verify(req, res){

}

async function logout(req, res){

}

async function changePassword(req, res){

}

async function sendForgotPasswordEmail(req, res){

}

async function resetPassword(req, res){

}

async function getCurrentUser(req, res){

}

module.exports = {
  register,
  login,
  verify,
  logout,
  changePassword,
  sendForgotPasswordEmail,
  resetPassword,
  getCurrentUser
}


