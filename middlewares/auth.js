const jwt = require('jsonwebtoken')
const userAccessor = require('../accessors/user.accessor');

async function authenticate(req, res, next) {

  const secret = process.env.FR_JWT_TOKEN || 'someSecretToLogin';
  if(!(req.cookies && req.cookies.access_token)){
    return res.status(401).json({
      success: false,
      messasge: "Not Authorized"
    });
  }
  try{
		const token = req.cookies.access_token;
    const decoded = jwt.verify(token, secret);
    const email = decoded.email;
    try{
      const found = await userAccessor.findByEmail(email);

      if(found.length < 1)
        return res.status(401).json({
          success: false,
          messasge: "Not Authorized"
        });

      const user = found[0];
      req.user = user;
      next();
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
      return res.status(401).json({
        success: false,
        messasge: "Not Authorized"
      });
  }

}

async function authorizeAdmin(req, res, next){
  authenticate(req, res, function (){
    const user = req.user
    if(!user || user.role !== 1){
      return res.status(403).json({
        success: false,
        messasge: "Forbidden"
      });
    }
    next()
  })
}


module.exports = {
  authenticate,
  authorizeAdmin
}
