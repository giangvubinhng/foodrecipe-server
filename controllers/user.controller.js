const { executeTransaction } = require('../models/db');
const userService = require('../services/user.service');

async function register(req, res) {
  const userRegisterRequestObject = req.body;
  const action = await userService.register(userRegisterRequestObject);
  return res.status(action.status).json(action.result);
}

async function login(req, res) {

  const userLoginRequestObject = req.body;
  const action = await userService.login(userLoginRequestObject);
  if (action.status !== 200) {
    return res.status(action.status).json(action.result)
  }
  return res.cookie("access_token", action.result.data.token, {
    httpOnly: true,
  }).status(action.status).json(action.result)


}

async function logout(_, res) {
  return res.clearCookie("access_token").status(200).json({
    success: true,
    message: "You have logged out",
  });
}

async function getCurrentUser(req, res) {

  let initialUser = {
    isLoggedIn: false
  }
  if (req.user) {
    const user = req.user;
    initialUser = {
      isLoggedIn: true,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name

    }
  }
  const responseObj = {
    success: true,
    message: "Ok",
    data: { user: initialUser }
  }
  return res.status(200).json(responseObj);

}


module.exports = {
  register,
  login,
  logout,
  getCurrentUser
}


