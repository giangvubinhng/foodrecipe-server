const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ResponseObject = require('../helpers/ResponseHandler')
const userAccessor = require('../accessors/user.accessor');

async function register(userRegisterRequestObject){

  let { email, password, firstName, lastName } = userRegisterRequestObject

  try{
    const found = await userAccessor.findByEmail(email);
    if(found.length > 0)
      return ResponseObject(400, "Email already exists");
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    const action = await userAccessor.insert(email, hashedPassword, firstName, lastName);
    const userId = Number(action.insertId)
    return ResponseObject(200, "User created successfully", {userId})
  }
  catch(e){
    console.log(e)
    return ResponseObject(500)
  }
}

async function login(userLoginRequestObject){
  const {email, password} = userLoginRequestObject;
  try{
    const found = await userAccessor.findByEmail(email);

    if(found.length < 1)
      return ResponseObject(400, "Incorrect username or password")

    const user = found[0];
    const correctPassword = await bcrypt.compare(password, user.password);

    if(!correctPassword)
      return ResponseObject(400, "Incorrect username or password")

    // assign token and send back to client
    const userObj = {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    }
    const token = jwt.sign(userObj, process.env.FR_JWT_TOKEN || 'justexample');

    return ResponseObject(200, undefined, {token, user: {...userObj, isLoggedIn: true}} );
  }
  catch(e){
    console.log(e)
    return ResponseObject(500)
  }

}
async function currentUser(token){
  let initialUserObject = {
    user:  {
      isLoggedIn: false
    }
  }
  try{
    const secret = process.env.FR_JWT_TOKEN || 'someSecretToLogin';
    const decoded = jwt.verify(token, secret);
    const email = decoded.email;
    try{
      const found = await userAccessor.findByEmail(email);

      if(found.length < 1)
        return ResponseObject(200, undefined, initialUserObject)

      const user = found[0];
      return ResponseObject(200, undefined, {user: {
        isLoggedIn: true,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name

      }})
    }
    catch(e){
      console.log(e)
      return res.status(500).json({
        success: false,
        messasge: "An internal error occurred"
      });
    }
  }catch(e){
      console.log(e)
      return ResponseObject(200, undefined, initialUserObject)
  }
}

module.exports = {
  register,
  login,
  currentUser
}
