const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/User");
const{signT,requireAuth}=require("../middleware/auth");

const COOKIE_OPTIONS={
  httpOnly:true,
  sameSite:"lax",
  secure:false,
};

router.post("/register",async(req,res)=>{
  try{
    console.log("=== /api/auth/register real handler ===");
    console.log("Body:", req.body);

    const{username,password,role}=req.body;
    if(!username||!password){
      return res.status(400).json({message:"Username/password rquired"});
    }
    
    const existing=await User.findOne({username});
    if(existing){
	return res.status(400).json({message:"Username already taken"});		
    }
	
    const hash=await bcrypt.hash(password,10);
    const user=await User.create({
	username, 
	passwordHash:hash, 
	role: role==="organizer"?"organizer":"visitor",
    });

    const token=signT(user);
    res
	.status(201)
	.cookie("token",token,COOKIE_OPTIONS)
	.json({id:user._id,username:user.username, role:user.role});
  }catch(err){
    console.error("Register error:",err.message);
    console.error(err.stack);
    res.status(500).json({message:"Registration failed"});
  }
});

// TEST register route
//router.post("/register", async (req, res) => {
//  console.log("=== /api/auth/register HIT ===");
//  console.log("Body:", req.body);

//  return res.status(200).json({ ok: true, echo: req.body });
//});

router.post("/login",async(req,res)=>{
  try{
    const{username,password}=req.body;
    if(!username||!password){
      return res.status(400).json({message:"Username/password rquired"});
    }

    const user=await User.findOne({username});
    if(!user) return res.status(400).json({message:"Invalid credentials"});

    const ok=await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({message:"Invalid credentials"});

    const token=signT(user);
    res.cookie("token",token,COOKIE_OPTIONS).json({id:user._id,username:user.username,role:user.role,});
  }catch(err){
    console.error("Login error:",err.message);
    console.error(err.stack);
    res.status(500).json({message:"Login failed"});
  }
});

router.post("/logout",(req,res)=>{
  res.clearCookie("token",COOKIE_OPTIONS);
  res.json({message:"Logout successfully"});
});

router.get("/me",requireAuth,(req,res)=>{
  res.json({
    id:req.user._id,
    username:req.user.username,
    role: req.user.role,
  });
});

module.exports=router;
