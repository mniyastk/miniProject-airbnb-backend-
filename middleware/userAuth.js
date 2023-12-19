const jwt = require('jsonwebtoken');
require("dotenv").config()
const userAuth = (req,res,next)=>{
    const token = req.headers.authorization;
    console.log(req.headers)
    if(!token){
        res.status(403).json({message:"token is required" ,status :"fail"})
    }else{
        try {
            const tokenValue = token.split(" ")[1];
            const decrypt = jwt.verify(tokenValue,process.env.USER_SECRET_KEY)
            req.user = decrypt
            next()
        } catch (error) {
            res.status(401).json({status:"fail" ,message:"invalid token"})
        }
      
    }
   
}
module.exports = userAuth