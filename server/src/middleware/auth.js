const jwt=require("jsonwebtoken");
const User=require("../models/User");

function signT(user){
  if(!process.env.JWT_SECRET){
	throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign(
    {id:user._id.toString(), role:user.role},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRES_IN||"7d"}
  );
}

async function requireAuth(req,res,next){
  try{
  	const token=req.cookies.token;
	if(!token) return res.status(401).json({messge:"Not authenticated"});
	
	const payload=jwt.verify(token,process.env.JWT_SECRET);
	const user=await User.findById(payload.id);
	if(!user) return res.status(401).json({message:"User not found"});
  	
	req.user=user;
	next();
  }catch(err){
	return res.status(401).json({message:"Invalid/Expired token"});
  }
}

function requireRole(role){
  return(req,res,next)=>{
	if(!req.user) return res.status(401).json({message:"Not authenticated"});
	if(req.user.role!==role){
	  return res.status(403).json({message:"Forbidden"});
	}
	next();
  };
}

module.exports={signT,requireAuth,requireRole};
