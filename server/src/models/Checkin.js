const mongoose=require("mongoose");

const checkinSchema=new mongoose.Schema(
  {
	event:{
	  type:mongoose.Schema.Types.ObjectId, 
	  ref:"Event", 
	  required:true
	},
	attendee:{
	  type:mongoose.Schema.Types.ObjectId,
	  ref:"User",
	  required:true
	},
	checkedAt:{
	  type:Date,
	  default:Date.now
	},
  },
  {timestamps:true}
);

module.exports=mongoose.model("Checkin",checkinSchema);
