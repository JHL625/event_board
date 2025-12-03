require("dotenv").config();
const express=require("express"); 
const cors=require("cors"); 
const connectDB=require("./src/config/db"); 
const eventRoutes=require("./src/routes/eventRoutes"); 
const cookieParser=require("cookie-parser"); 
const authRoutes=require("./src/routes/authRoutes"); 
const rsvpRoutes=require("./src/routes/rsvpRoutes"); 
const checkinRoutes=require("./src/routes/checkinRoutes");
//const { requireAuth } = require("./src/middleware/auth");
//const Event = require("./src/models/Event");
//const Rsvp = require("./src/models/Rsvp");
//const Checkin = require("./src/models/Checkin");

const app=express();
app.use(cors({
  origin:"http://ec2-18-224-94-170.us-east-2.compute.amazonaws.com/:5173",
  credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth",authRoutes);
app.use("/api/events",eventRoutes);
app.use("/api/rsvps",rsvpRoutes);
app.use("/api/checkins",checkinRoutes);

//test
app.get("/api/health", (req,res)=>{
	res.json({ok:true, message:"API is up"});
});

const PORT=process.env.PORT||4000;
app.listen(PORT,()=>{
	console.log(`Server running on http://localhost:${PORT}`);
});
