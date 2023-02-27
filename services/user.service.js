const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
async function login(userLoginRequestObject) {

  let response;
  const {email, password} = userLoginRequestObject;
  const found = await userAccessor.findByEmail(email);
  if(!found.success){
    response = {
      result: {
        success: false,
        message: "An error has occurred, please try again later",
      },
      status: 500,
    }
  }
  else{
    if(found.data.length < 1){
      response = {
        result: {
          success: false,
          message: "Incorrect username or password",
        },
        status: 400,
      }
    }
    else{
      const foundUser = found.data[0];
      console.log(foundUser)
      const correctPassword = await bcrypt.compare(password, foundUser.password);
      if(!correctPassword){
        response = {
          result: {
            success: false,
            message: "Incorrect username or password",
          },
          status: 400,
        }
      }
      else{
        // assign token and send back to client
        const token = jwt.sign({
          email: foundUser.email,
          firstName: foundUser.first_name,
          lastName: foundUser.last_name
        }, process.env.FR_JWT_TOKEN || 'justexample')
        response = {
          result: {
            success: true,
            data: token,
            message: "Logged in successfully",
          },
          status: 200
        }
      }
    }
  }
  return response;



}
module.exports = {
  register,
  login
}
