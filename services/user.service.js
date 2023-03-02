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
    const token = jwt.sign({
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    }, process.env.FR_JWT_TOKEN || 'justexample');

    return ResponseObject(200, undefined, {token} );
  }
  catch(e){
    console.log(e)
    return ResponseObject(500)
  }

}

module.exports = {
  register,
  login
}
