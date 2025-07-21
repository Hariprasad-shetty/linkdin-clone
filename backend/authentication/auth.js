

const jwt=require("jsonwebtoken");
const User=require("../models/user");

exports.auth=async (req,res,next)=>{
  
  try {
    const token= req.cookies.token;
    if(!token){
      console.log("req.cookies.token:", req.cookies.token);
      console.log(req.user)
      return res.status(401).json({error: "No token, authorization denied"});
      
    }
    
    const decode= jwt.verify(token,process.env.JWT_PRIVATE_KEY);
      req.user=await User.findById(decode.userId).select("-password")
    // const user = await User.findById(decoded.userId).select("-password");
    // if (!user) {
    //   return res.status(401).json({ error: "User not found" });
    // }

    // req.user = user;
    next();
    
  } catch (error) {
    
    res.status(401).json({error: "Token is not valid"});
    
  }
  
}