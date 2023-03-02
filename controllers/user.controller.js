const { executeTransaction } = require('../models/db');
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
  return res.cookie("access_token", action.result.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }).status(action.status).json(action.result)


}

async function logout(req, res){
	if (req.cookies.access_token) {
		res.clearCookie("access_token").status(200).json({
			success: true,
			message: "You have logged out",
		});
	} else {
		res.status(403).json({
			success: false,
			message: "Unable to process request",
		});
	}
}

async function changePassword(req, res){

}

async function sendForgotPasswordEmail(req, res){

}

async function resetPassword(req, res){

}

async function getCurrentUser(req, res){

}

// adds an entry containing user_id and recipe_id to the user_favorite table
// for reference- req:{"userId": #, "recipeId":#}
async function addFavRecipe(req, res){
  var sql_cmd = "INSERT INTO user_favorite (user_id, recipe_id) VALUES (" + req["userId"] + ", " + req["recipeId"] + ");"
  executeTransaction(sql_cmd, 0)
}

// deletes an entry containing user_id and recipe_id from the user_favorite table
// for reference- req:{"userId": #, "recipeId":#}
async function delFavRecipe(req, res){
  var sql_cmd = "DELETE FROM user_favorite WHERE user_id = " + req["userId"] + " AND recipe_id = " + req["recipeId"] + ";"
  executeTransaction(sql_cmd, 0)
}

module.exports = {
  register,
  login,
  logout,
  changePassword,
  sendForgotPasswordEmail,
  resetPassword,
  getCurrentUser,
  addFavRecipe,
  delFavRecipe
}


