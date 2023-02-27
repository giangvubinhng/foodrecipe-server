const userService = require('../services/user.service');

async function register(req, res){
  const userRegisterRequestObject = req.body;
  const action = await userService.register(userRegisterRequestObject);
  return res.status(action.status).json(action.result);
}

async function login(req, res){
  const userLoginRequestObject = req.body;
  const action = await userService.login(userLoginRequestObject);
  if(action.status !== 200){
    return res.status(action.status).json(action.result)
  }
  return res.cookie("access_token", action.result.data, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }).status(action.status).json(action.result)


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


