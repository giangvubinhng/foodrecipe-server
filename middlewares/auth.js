const jwt = require('jsonwebtoken')
const userAccessor = require('../accessors/user.accessor');

export async function authenticate(req, res, next) {

  const secret = process.env.FR_JWT_TOKEN || 'someSecretToLogin';
  if(!(req.cookies && req.cookies.access_token)){
    return res.status(401).json({
      success: false,
      messasge: "Invalid request"
    });
  }
  try{
		const token = req.cookies.access_token;
    const decoded = jwt.verify(token, secret);
    const email = decoded.email;
    const found = await userAccessor.findByEmail(email);
    if(!found.success){
      return res.status(500).json({
        success: false,
        messasge: "An internal error occurred"
      });
    }
    if(found.data.length < 1){
      return res.status(401).json({
        success: false,
        messasge: "Invalid request"
      });
    }
    const user = found.data[0];
    req.user = user;
    next();
  }catch(e){
      return res.status(401).json({
        success: false,
        messasge: "Invalid request"
      });
  }

}

export async function authorizeAdmin(req, res, next){

  await authenticate(req, res, next)
  const user = req.user
  if(!user || user.role !== 1){
    return res.status(403).json({
      success: false,
      messasge: "Unauthorized request"
    });
  }
  next()

}
