const mongoose=require("mongoose");

const eventSchema = new mongoose.Schema(
  {
	title:{type:String, required:true},
	description:String,
	date:{type:Date, required:true},
	location:{type:String, required:true},
	category:{type:String, default:"Other"},
	capacity:{type:Number,default:0},
	organizer:{
	  type:mongoose.Schema.Types.ObjectId, ref:"User",required:true,},
  	rsvpCount:{type:Number, default:0},
 	checkinCount:{type:Number, default:0},
  	
	posterUrl:{type:String, default:""},	

	expiresAt:{
	  type:Date,
	  index:{expires:0}, //TTL index expire exactly at this time
	}
  },
  {timestamps:true}
);

module.exports=mongoose.model("Event",eventSchema);
