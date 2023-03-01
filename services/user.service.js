const bcrypt = require('bcrypt');

const userAccessor = require('../accessors/user.accessor');

async function register(userRegisterRequestObject){

  let response;
  let { email, password, firstName, lastName } = userRegisterRequestObject

  const found = await userAccessor.findByEmail(email);
  if(found.success){
    if(found.data.length > 0){
      response = {
        result: {
          success: false,
          message: "A user with this email already exists",
        },
        status: 400,
      }
    }
    else{
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
      const newUser = {
        email,
        hashedPassword,
        firstName,
        lastName
      }
      const action = await userAccessor.createUser(newUser)

      if(action.success){
        response = {
          result: {
            success: true, 
            message: "User registered successfully!", 
          },
          status: 200
        }
      }
      else{
        response = {
          result: {
            success: false,
            message: "An error has occurred, please try again later",
          },
          status: 500,
        }
      }
    }
  }
  else{
    response = {
      result: {
        success: false,
        message: "An error has occurred, please try again later",
      },
      status: 500,
    }
  }
  return response;
}

module.exports = {
  register
}
